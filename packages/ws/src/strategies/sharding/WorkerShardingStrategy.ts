import { once } from "node:events";
import { join, isAbsolute, resolve } from "node:path";
import { Worker } from "node:worker_threads";
import type { GatewaySendPayload } from "discord-api-types/v10";
import { IdentifyThrottler } from "../../utils/IdentifyThrottler.js";
import type { SessionInfo, WebSocketManager } from "../../ws/WebSocketManager";
import type { WebSocketShardDestroyOptions, WebSocketShardEvents, WebSocketShardStatus } from "../../ws/WebSocketShard";
import { managerToFetchingStrategyOptions, type FetchingStrategyOptions } from "../context/IContextFetchingStrategy.js";
import type { IShardingStrategy } from "./IShardingStrategy.js";

export interface WorkerData extends FetchingStrategyOptions {
	shardIds: number[];
}

export enum WorkerSendPayloadOp {
	Connect = 0,
	Destroy = 1,
	Send = 2,
	SessionInfoResponse = 3,
	ShardCanIdentify = 4,
	FetchStatus = 5,
}

export type WorkerSendPayload =
	| { nonce: number; op: WorkerSendPayloadOp.FetchStatus; shardId: number }
	| {
			nonce: number;
			op: WorkerSendPayloadOp.SessionInfoResponse;
			session: SessionInfo | null;
	  }
	| { nonce: number; op: WorkerSendPayloadOp.ShardCanIdentify }
	| { op: WorkerSendPayloadOp.Connect; shardId: number }
	| {
			op: WorkerSendPayloadOp.Destroy;
			options?: WebSocketShardDestroyOptions;
			shardId: number;
	  }
	| {
			op: WorkerSendPayloadOp.Send;
			payload: GatewaySendPayload;
			shardId: number;
	  };

export enum WorkerReceivePayloadOp {
	Connected = 0,
	Destroyed = 1,
	Event = 2,
	RetrieveSessionInfo = 3,
	UpdateSessionInfo = 4,
	WaitForIdentify = 5,
	FetchStatusResponse = 6,
	WorkerReady = 7,
}

export type WorkerReceivePayload =
	// Can't seem to get a type-safe union based off of the event, so I'm sadly leaving data as any for now
	| {
			data: any;
			event: WebSocketShardEvents;
			op: WorkerReceivePayloadOp.Event;
			shardId: number;
	  }
	| {
			nonce: number;
			op: WorkerReceivePayloadOp.FetchStatusResponse;
			status: WebSocketShardStatus;
	  }
	| {
			nonce: number;
			op: WorkerReceivePayloadOp.RetrieveSessionInfo;
			shardId: number;
	  }
	| { nonce: number; op: WorkerReceivePayloadOp.WaitForIdentify }
	| { op: WorkerReceivePayloadOp.Connected; shardId: number }
	| { op: WorkerReceivePayloadOp.Destroyed; shardId: number }
	| {
			op: WorkerReceivePayloadOp.UpdateSessionInfo;
			session: SessionInfo | null;
			shardId: number;
	  }
	| { op: WorkerReceivePayloadOp.WorkerReady };

/**
 * Options for a {@link WorkerShardingStrategy}
 */
export interface WorkerShardingStrategyOptions {
	/**
	 * Dictates how many shards should be spawned per worker thread.
	 */
	shardsPerWorker: number | "all";
	/**
	 * Path to the worker file to use. The worker requires quite a bit of setup, it is recommended you leverage the {@link WorkerBootstrapper} class.
	 */
	workerPath?: string;
}

/**
 * Strategy used to spawn threads in worker_threads
 */
export class WorkerShardingStrategy implements IShardingStrategy {
	private readonly manager: WebSocketManager;

	private readonly options: WorkerShardingStrategyOptions;

	#workers: Worker[] = [];

	readonly #workerByShardId = new Map<number, Worker>();

	private readonly connectPromises = new Map<number, () => void>();

	private readonly destroyPromises = new Map<number, () => void>();

	private readonly fetchStatusPromises = new Map<number, (status: WebSocketShardStatus) => void>();

	private readonly throttler: IdentifyThrottler;

	public constructor(manager: WebSocketManager, options: WorkerShardingStrategyOptions) {
		this.manager = manager;
		this.throttler = new IdentifyThrottler(manager);
		this.options = options;
	}

	/**
	 * {@inheritDoc IShardingStrategy.spawn}
	 */
	public async spawn(shardIds: number[]) {
		const shardsPerWorker = this.options.shardsPerWorker === "all" ? shardIds.length : this.options.shardsPerWorker;
		const strategyOptions = await managerToFetchingStrategyOptions(this.manager);

		const loops = Math.ceil(shardIds.length / shardsPerWorker);
		const promises: Promise<void>[] = [];

		for (let idx = 0; idx < loops; idx++) {
			const slice = shardIds.slice(idx * shardsPerWorker, (idx + 1) * shardsPerWorker);
			const workerData: WorkerData = {
				...strategyOptions,
				shardIds: slice,
			};

			promises.push(this.setupWorker(workerData));
		}

		await Promise.all(promises);
	}

	/**
	 * {@inheritDoc IShardingStrategy.connect}
	 */
	public async connect() {
		const promises = [];

		for (const [shardId, worker] of this.#workerByShardId.entries()) {
			const payload = {
				op: WorkerSendPayloadOp.Connect,
				shardId,
			} as WorkerSendPayload;

			// eslint-disable-next-line no-promise-executor-return
			const promise = new Promise<void>((resolve) => this.connectPromises.set(shardId, resolve));
			worker.postMessage(payload);
			promises.push(promise);
		}

		await Promise.all(promises);
	}

	/**
	 * {@inheritDoc IShardingStrategy.destroy}
	 */
	public async destroy(options: Omit<WebSocketShardDestroyOptions, "recover"> = {}) {
		const promises = [];

		for (const [shardId, worker] of this.#workerByShardId.entries()) {
			const payload = {
				op: WorkerSendPayloadOp.Destroy,
				shardId,
				options,
			} as WorkerSendPayload;

			promises.push(
				// eslint-disable-next-line no-promise-executor-return, promise/prefer-await-to-then
				new Promise<void>((resolve) => this.destroyPromises.set(shardId, resolve)).then(async () => worker.terminate()),
			);
			worker.postMessage(payload);
		}

		this.#workers = [];
		this.#workerByShardId.clear();

		await Promise.all(promises);
	}

	/**
	 * {@inheritDoc IShardingStrategy.send}
	 */
	public send(shardId: number, data: GatewaySendPayload) {
		const worker = this.#workerByShardId.get(shardId);
		if (!worker) {
			throw new Error(`No worker found for shard ${shardId}`);
		}

		const payload = {
			op: WorkerSendPayloadOp.Send,
			shardId,
			payload: data,
		} as WorkerSendPayload;
		worker.postMessage(payload);
	}

	/**
	 * {@inheritDoc IShardingStrategy.fetchStatus}
	 */
	public async fetchStatus() {
		const statuses = new Map<number, WebSocketShardStatus>();

		for (const [shardId, worker] of this.#workerByShardId.entries()) {
			const nonce = Math.random();
			const payload = {
				op: WorkerSendPayloadOp.FetchStatus,
				shardId,
				nonce,
			} as WorkerSendPayload;

			// eslint-disable-next-line no-promise-executor-return
			const promise = new Promise<WebSocketShardStatus>((resolve) => this.fetchStatusPromises.set(nonce, resolve));
			worker.postMessage(payload);

			const status = await promise;
			statuses.set(shardId, status);
		}

		return statuses;
	}

	private async setupWorker(workerData: WorkerData) {
		const worker = new Worker(this.resolveWorkerPath(), { workerData });

		await once(worker, "online");
		// We do this in case the user has any potentially long running code in their worker
		await this.waitForWorkerReady(worker);

		worker
			.on("error", (err) => {
				throw err;
			})
			.on("messageerror", (err) => {
				throw err;
			})
			.on("message", async (payload: WorkerReceivePayload) => this.onMessage(worker, payload));

		this.#workers.push(worker);
		for (const shardId of workerData.shardIds) {
			this.#workerByShardId.set(shardId, worker);
		}
	}

	private resolveWorkerPath(): string {
		const path = this.options.workerPath;

		if (!path) {
			return join(__dirname, "defaultWorker.js");
		}

		if (isAbsolute(path)) {
			return path;
		}

		if (/^\.\.?[/\\]/.test(path)) {
			return resolve(path);
		}

		try {
			return require.resolve(path);
		} catch {
			return resolve(path);
		}
	}

	private async waitForWorkerReady(worker: Worker): Promise<void> {
		return new Promise((resolve) => {
			const handler = (payload: WorkerReceivePayload) => {
				if (payload.op === WorkerReceivePayloadOp.WorkerReady) {
					resolve();
					worker.off("message", handler);
				}
			};

			worker.on("message", handler);
		});
	}

	private async onMessage(worker: Worker, payload: WorkerReceivePayload) {
		switch (payload.op) {
			case WorkerReceivePayloadOp.Connected: {
				this.connectPromises.get(payload.shardId)?.();
				this.connectPromises.delete(payload.shardId);
				break;
			}

			case WorkerReceivePayloadOp.Destroyed: {
				this.destroyPromises.get(payload.shardId)?.();
				this.destroyPromises.delete(payload.shardId);
				break;
			}

			case WorkerReceivePayloadOp.Event: {
				this.manager.emit(payload.event, {
					...payload.data,
					shardId: payload.shardId,
				});
				break;
			}

			case WorkerReceivePayloadOp.RetrieveSessionInfo: {
				const session = await this.manager.options.retrieveSessionInfo(payload.shardId);
				const response: WorkerSendPayload = {
					op: WorkerSendPayloadOp.SessionInfoResponse,
					nonce: payload.nonce,
					session,
				};
				worker.postMessage(response);
				break;
			}

			case WorkerReceivePayloadOp.UpdateSessionInfo: {
				await this.manager.options.updateSessionInfo(payload.shardId, payload.session);
				break;
			}

			case WorkerReceivePayloadOp.WaitForIdentify: {
				await this.throttler.waitForIdentify();
				const response: WorkerSendPayload = {
					op: WorkerSendPayloadOp.ShardCanIdentify,
					nonce: payload.nonce,
				};
				worker.postMessage(response);
				break;
			}

			case WorkerReceivePayloadOp.FetchStatusResponse: {
				this.fetchStatusPromises.get(payload.nonce)?.(payload.status);
				this.fetchStatusPromises.delete(payload.nonce);
				break;
			}

			case WorkerReceivePayloadOp.WorkerReady: {
				break;
			}
		}
	}
}
