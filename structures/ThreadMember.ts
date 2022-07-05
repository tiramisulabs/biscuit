import type { Model } from "./Base.ts";
import type { Session } from "../session/Session.ts";
import type { Snowflake } from "../util/Snowflake.ts";
import type { DiscordThreadMember } from "../vendor/external.ts";
import * as Routes from "../util/Routes.ts";

/**
 * A member that comes from a thread
 * @link https://discord.com/developers/docs/resources/channel#thread-member-object
 * **/
export class ThreadMember implements Model {
    constructor(session: Session, data: DiscordThreadMember) {
        this.session = session;
        this.id = data.id;
        this.flags = data.flags;
        this.timestamp = Date.parse(data.join_timestamp);
    }

    readonly session: Session;
    readonly id: Snowflake;
    flags: number;
    timestamp: number;

    get threadId() {
        return this.id;
    }

    async quitThread(memberId: Snowflake = this.session.botId) {
        await this.session.rest.runMethod<undefined>(
            this.session.rest,
            "DELETE",
            Routes.THREAD_USER(this.id, memberId),
        );
    }

    async fetchMember(memberId: Snowflake = this.session.botId) {
        const member = await this.session.rest.runMethod<DiscordThreadMember>(
            this.session.rest,
            "GET",
            Routes.THREAD_USER(this.id, memberId),
        );

        return new ThreadMember(this.session, member);
    }
}

export default ThreadMember;