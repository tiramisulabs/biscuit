import type { DiscordBase, Locales, PremiumTypes, VisibilityTypes } from './common';

/** @link https://discord.com/developers/docs/resources/user#user-object-user-structure */
export interface DiscordUser extends DiscordBase {
    /** the user's username, not unique across the platform */
    username: string;
    /**	the user's 4-digit discord-tag */
    discriminator: string;
    /** the user's avatar hash */
    avatar: string | null;
    /** whether the user belongs to an OAuth2 application */
    bot?: boolean;
    /** whether the user is an Official Discord System user (part of the urgent message system) */
    system?: boolean;
    /** the user's banner hash */
    banner?: string | null;
    /** the user's banner color encoded as an integer representation of hexadecimal color code */
    accent_color?: number | null;
    /**	the public flags on a user's account */
    public_flags?: number;
}

export interface DiscordUserOAUTH2 extends DiscordUser {
    /** whether the user has two factor enabled on their account */
    mfa_enabled?: boolean;
    /** the user's chosen language option */
    locale: `${Locales}`;
    /**	the flags on a user's account */
    flags?: number;
    /**	the type of Nitro subscription on a user's account */
    premium_type?: PremiumTypes;
}

export interface DiscordUserWithOAUTH2Email extends DiscordUserOAUTH2 {
    /** whether the email on this account has been verified */
    verified?: boolean;
    /** the user's email */
    email?: string | null;
}

/** @link https://discord.com/developers/docs/resources/user#connection-object-connection-structure */

export interface DiscordConnection {
    /** id of the connection account */
    id: string;
    /** the username of the connection account */
    name: string;
    /** the service of this connection */
    type: keyof typeof DiscordServices;
    /** whether the connection is revoked */
    revoked?: boolean;
    /** an array of partial server integrations */
    integrations?: any[]; // server integrations object
    /**	whether the connection is verified */
    verified: boolean;
    /**	whether friend sync is enabled for this connection */
    friend_sync: boolean;
    /** whether activities related to this connection will be shown in presence updates */
    show_activity: boolean;
    /** whether this connection has a corresponding third party OAuth2 token */
    two_way_link: boolean;
    /** visibility of this connection */
    visibility: VisibilityTypes;

}

/** @link https://discord.com/developers/docs/resources/user#connection-object-services */
export enum DiscordServices {
    battlenet = 'Battle.net',
    ebay = 'eBay',
    epicgames = 'Epic Games',
    facebook = 'Facebook',
    github = 'GitHub',
    leagueoflegends = 'League of Legends',
    paypal = 'Paypal',
    playstation = 'PlayStation Network',
    reddit = 'Reddit',
    riotgames = 'Riot Games',
    spotify = 'Spotify',
    skype = 'Skype',
    steam = 'Steam',
    twitch = 'Twitch',
    twitter = 'Twitter',
    xbox = 'Xbox',
    youtube = 'YouTube'
}
