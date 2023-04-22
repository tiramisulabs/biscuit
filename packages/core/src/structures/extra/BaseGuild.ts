import type { APIGuild, APIPartialGuild } from '@biscuitland/common';
import { GuildFeature } from '@biscuitland/common';
import type { Session } from '../../session';
import { ImageOptions, formatImageURL } from '../../';
import { DiscordBase } from './DiscordBase';

/**
 * Class for {@link Guild} and {@link AnonymousGuild}
 */
export class BaseGuild extends DiscordBase {
	constructor(session: Session, data: APIGuild | APIPartialGuild) {
		super(session, data.id);
		this.name = data.name;
		this.icon = data.icon ?? undefined;
		this.features = data.features;
	}

	/** Guild name. */
	name: string;

	/**
	 * Icon hash. Discord uses ids and hashes to render images in the client.
	 * @link https://discord.com/developers/docs/reference#image-formatting
	 */
	icon?: string;

	/**
	 * Enabled guild features (animated banner, news, auto moderation, etc).
	 * @link https://discord.com/developers/docs/resources/guild#guild-object-guild-features
	 */
	features?: `${GuildFeature}`[];

	/**
	 * If the guild features includes partnered.
	 * @link https://discord.com/developers/docs/resources/guild#guild-object-guild-features
	 */
	get partnered(): boolean {
		if (!this.features) {
			return false;
		}
		return this.features.includes(GuildFeature.Partnered);
	}

	/**
	 * If the guild is verified.
	 * @link https://discord.com/developers/docs/resources/guild#guild-object-guild-features
	 */
	get verifed(): boolean {
		if (!this.features) {
			return false;
		}
		return this.features.includes(GuildFeature.Verified);
	}

	/**
	 * iconURL gets the current guild icon.
	 * @link https://discord.com/developers/docs/reference#image-formatting
	 */
	iconURL(options?: ImageOptions): string | void {
		if (!this.icon) {
			return;
		}
		return formatImageURL(
			this.session.cdn.icons(this.id).get(this.icon),
			options?.size,
			options?.format
		);
	}

	toString(): string {
		return this.name;
	}
}