import type { Snowflake, DiscordBase } from './common';
import type { DiscordUser } from './user';

/** @link https://discord.com/developers/docs/resources/application#application-object-application-structure */
export interface DiscordApplication extends DiscordBase {
    /**	the name of the app */
    name: string;
    /** the icon hash of the app */
    icon: string | null;
    /** the description of the app */
    description: string;
    /**	an array of rpc origin urls, if rpc is enabled */
    rpc_origins?: string[];
    /** when false only app owner can join the app's bot to guilds */
    bot_public: boolean;
    /** when true the app's bot will only join upon completion of the full oauth2 code grant flow */
    bot_require_code_grant: boolean;
    /** the url of the app's terms of service */
    terms_of_service_url?: string;
    /** the url of the app's privacy policy */
    privacy_police_url?: string;
    /** partial user object containing info on the owner of the application */
    owner: Partial<DiscordUser>;
    /** @deprecated and will be removed in v11. An empty string. */
    summary: string;
    /** the hex encoded key for verification in interactions and the GameSDK's  */
    veify_key: string;
    /** if the application belongs to a team, this will be a list of the members of that team */
    team: any | null;
    /** if this application is a game sold on Discord, this field will be the guild to which it has been linked */
    guild_id?: Snowflake;
    /** if this application is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists */
    primary_sku_id?: Snowflake;
    /** if this application is a game sold on Discord, this field will be the URL slug that links to the store page */
    slug?: string;
    /**	the application's default rich presence invite cover image hash */
    cover_image?: string;
    /**	the application's public flags */
    flags?: DiscordApplicationFlags;
    /**	up to 5 tags describing the content and functionality of the application */
    tags?: string[];
    /**	settings for the application's default in-app authorization link, if enabled */
    install_params?: DiscordApplicationInstallParams;
    /**	the application's default custom authorization link, if enabled */
    custom_install_url?: string;
}

/** @link https://discord.com/developers/docs/resources/application#application-object-application-flags */
export enum DiscordApplicationFlags {
    /** Intent required for bots in **100 or more servers** to receive [`presence_update` events](#DOCS_TOPICS_GATEWAY/presence-update) */
	GatewayPresence = 1 << 12,
	/** Intent required for bots in under 100 servers to receive [`presence_update` events](#DOCS_TOPICS_GATEWAY/presence-update), found in Bot Settings */
	GatewayPresenceLimited = 1 << 13,
	/** Intent required for bots in **100 or more servers** to receive member-related events like `guild_member_add`. See list of member-related events [under `GUILD_MEMBERS`](#DOCS_TOPICS_GATEWAY/list-of-intents) */
	GatewayGuildMembers = 1 << 14,
	/** Intent required for bots in under 100 servers to receive member-related events like `guild_member_add`, found in Bot Settings. See list of member-related events [under `GUILD_MEMBERS`](#DOCS_TOPICS_GATEWAY/list-of-intents) */
	GatewayGuildMembersLimited = 1 << 15,
	/** Indicates unusual growth of an app that prevents verification */
	VerificationPendingGuildLimit = 1 << 16,
	/** Indicates if an app is embedded within the Discord client (currently unavailable publicly) */
	Embedded = 1 << 17,
	/** Intent required for bots in **100 or more servers** to receive [message content](https://support-dev.discord.com/hc/en-us/articles/4404772028055) */
	GatewayMessageCount = 1 << 18,
	/** Intent required for bots in under 100 servers to receive [message content](https://support-dev.discord.com/hc/en-us/articles/4404772028055), found in Bot Settings */
	GatewayMessageContentLimited = 1 << 19,
}

/** @link https://discord.com/developers/docs/resources/application#install-params-object-install-params-structure */
export interface DiscordApplicationInstallParams {
    /**	the scopes to add the application to the server with */
    scopes: string[];
    /** the permissions to request for the bot role */
    permissions: string;
}
