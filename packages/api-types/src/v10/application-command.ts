import type { ChannelTypes } from './channel';
import type { Snowflake, Localizations, DiscordBase } from './common';

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure */
export interface ApplicationCommand extends ApplicationCommandLocalizations, DiscordBase {
	/** Type of command, defaults to 1 */
	type?: ApplicationCommandTypes;
	/** ID of the parent application */
	applicationId: Snowflake;
	/**  Guild id of the command, if not global */
	guild_id?: Snowflake;
	/** Name of command, 1-32 characters */
	name: string;
	/**
	 * Description for CHAT_INPUT commands, 1-100 characters.
	 * Empty string for USER and MESSAGE commands
	 */
	description: string;
	/** Set of permissions represented as a bit set */
	default_member_permissions?: string;
	/**
	 * Indicates whether the command is available in DMs with the app,
	 * only for globally-scoped commands. By default, commands are visible.
	 */
	dm_permission?: boolean;
	/** Indicates whether the command is enabled by default when the app is added to a guild, defaults to true
	 * @deprecated
	 */
	default_permission?: boolean;
	/** Autoincrementing version identifier updated during substantial record changes */
	readonly version: number;
}

export interface ApplicationCommandLocalizations {
	/**
	 * Localization dictionary for name field.
	 * Values follow the same restrictions as name
	 */
	name_localizations?: Localizations;
	/**
	 * Localization dictionary for description field.
	 * Values follow the same restrictions as description
	 */
	description_localizations?: Localizations;
}

export interface ApplicationChatInputCommand<T extends ApplicationCommandOption> extends ApplicationCommand {
	options?: T[];
}

export interface ApplicationUserCommand extends ApplicationCommand {}

export interface ApplicationMessageCommand extends ApplicationCommand {}

export type DiscordApplicationCommand = ApplicationMessageCommand | ApplicationUserCommand | ApplicationChatInputCommand<ApplicationCommandOptions>;

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure */
export interface ApplicationCommandOption extends ApplicationCommandLocalizations {
	/** Type of option */
	type: ApplicationCommandOptionTypes;
	/** 1-32 character name */
	name: string;
	/** 1-100 character description */
	description: string;
	/** If the parameter is required or optional, by default false */
	required?: boolean;
	/** If autocomplete interactions are enabled */
	autocomplete?: boolean;
}

export interface ApplicationCommandWithOptions<T extends ApplicationCommandOption>
	extends Omit<ApplicationCommandOption, 'autocomplete'> {
	options: T[];
}

export type ApplicationCommandSubCommandOption = ApplicationCommandWithOptions<ApplicationCommandOptions>;

export type ApplicationCommandSubGroupOption = ApplicationCommandWithOptions<ApplicationCommandSubCommandOption>;

export interface ApplicationCommandStringOption extends ApplicationCommandOption {
	type: ApplicationCommandOptionTypes.String;
	/** The minimum allowed length (minimum of 0) */
	min_length?: number;
	/** The maximum allowed length (maximum of 6000) */
	max_length?: number;
}

export interface ApplicationCommandIntegerOrNumberOption extends ApplicationCommandOption {
	type: ApplicationCommandOptionTypes.Integer | ApplicationCommandOptionTypes.Number;
	/** The minimum value permitted */
	min_value?: number;
	/** The maximum value permitted */
	max_value?: number;
}

export interface ApplicationCommandChannelOption extends ApplicationCommandOption {
	type: ApplicationCommandOptionTypes.Channel;
	/** If the option is a channel type, the channels shown will be restricted to these types */
	channel_types: ChannelTypes[];
}

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure */
export interface ApplicationCommandOptionChoice
	extends Omit<ApplicationCommandLocalizations, 'description_localizations'> {
	/** 1-100 character choice name */
	name: string;
	/** Value for the choice, up to 100 characters if string */
	value: string | number;
}

export interface ApplicationCommandWithChoices extends Omit<ApplicationCommandOption, 'autocomplete'> {
	choices: ApplicationCommandOptionChoice[];
}

export type ApplicationCommandOptions =
	| ApplicationCommandChannelOption
	| ApplicationCommandWithChoices
	| ApplicationCommandIntegerOrNumberOption
	| ApplicationCommandStringOption;

/** @link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types */
export enum ApplicationCommandTypes {
	/** A text-based command that shows up when a user types `/` */
	ChatInput = 1,
	/** A UI-based command that shows up when you right click or tap on a user */
	User,
	/** A UI-based command that shows up when you right click or tap on a message */
	Message,
}

/** @link https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype */
export enum ApplicationCommandOptionTypes {
	SubCommand = 1,
	SubCommandGroup,
	String,
	/** Any integer between -2^53 and 2^53 */
	Integer,
	Boolean,
	User,
	/** Includes all channel types + categories */
	Channel,
	Role,
	/** Includes users and roles */
	Mentionable,
	/** Any double between -2^53 and 2^53 */
	Number,
	/** attachment object */
	Attachment,
}
