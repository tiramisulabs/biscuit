import type {
	ApplicationCommandTypes,
	ApplicationCommandOptionTypes,
	ApplicationCommandOptionChoice,
} from './application-command';
import type { DiscordBase, Snowflake, InteractionTypes, Locales } from './common';
import type {
	DiscordSelectMenuOption,
	MessageComponentTypes,
	DiscordMessageComponents,
	DiscordActionRowComponent,
    DiscordTextInput,
} from './message-component';
import type { DiscordUser } from './user';

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure */
export interface DiscordInteraction extends DiscordBase {
	/** ID of the application this interaction is for */
	application_id: Snowflake;
	/** Type of interaction */
	type: InteractionTypes;
	/** Guild that the interaction was sent from */
	guild_id?: Snowflake;
	/**	Channel that the interaction was sent from */
	channel_id?: Snowflake;
	/**	Continuation token for responding to the interaction */
	token: string;
	/** Read-only property, always 1 */
	readonly version: number;
	/** Bitwise set of permissions the app or bot has within the channel the interaction was sent from */
	app_permissions?: string;
	/** Selected language of the invoking user */
	locale?: `${Locales}`;
	/** Guild's preferred locale, if invoked in a guild */
	guild_locale?: `${Locales}`;
}

export interface DiscordInteractionWithMember extends DiscordInteraction {
	/** Guild member data for the invoking user, including permissions */
	member: Record<string, any>;
}

export interface DiscordInteractionWithUser extends DiscordInteraction {
	/** User object for the invoking user, if invoked in a DM */
	user: DiscordUser;
}

export interface DiscordApplicationCommandInteraction extends DiscordInteraction {
	type: InteractionTypes.ApplicationCommand;
	/** Interaction data payload */
	data?: DiscordApplicationCommandInteractionData;
}

export interface DiscordComponentInteraction extends DiscordInteraction {
	type: InteractionTypes.MessageComponent;
	/** the message they were attached to */
	message: Record<string, any>;
	/** Interaction data payload */
	data?: DiscordMessageComponentInteractionData | DiscordMessageSelectMenuInteractionData;
}

export type DiscordComponentInteractionWithUser = DiscordComponentInteraction & { user: DiscordUser };

export type DiscordComponentInteractionWithMember = DiscordComponentInteraction & { member: any };

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#message-interaction-object-message-interaction-structure */

export interface DiscordMessageInteraction extends DiscordBase {
	type: InteractionTypes;
	name: string;
}

export type DiscordMessageInteractionWithUser = DiscordComponentInteraction & { user: DiscordUser };

export type DiscordMessageInteractionWithMember = DiscordComponentInteraction & { member: any };

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-data-structure */
export interface DiscordApplicationCommandInteractionData extends DiscordBase {
	/** the name of the invoked command */
	name: string;
	/** the type of the invoked command */
	type: ApplicationCommandTypes;
	/**	converted users + roles + channels + attachments */
	resolved?: DiscordInteractionCommandDataResolved;
	/**	the params + values from the user */
	options?: DiscordApplicationCommandInteractionDataOption[];
	/**	the id of the guild the command is registered to */
	guild_id?: Snowflake;
	/** id of the user or message targeted by a user or message command */
	target_id?: Snowflake;
}

export interface DiscordInteractionCommandAutocompleteData
	extends Omit<DiscordApplicationCommandInteractionData, 'options'> {
	options?: Partial<DiscordApplicationCommandInteractionDataOption>[];
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-interaction-data-option-structure */
export interface DiscordApplicationCommandInteractionDataOption {
	/** Name of the parameter */
	name: string;
	/** Value of application command option type */
	type: ApplicationCommandOptionTypes;
	/**	Value of the option resulting from user input */
	value?: string | number;
	/** Present if this option is a group or subcommand */
	options?: DiscordApplicationCommandInteractionDataOption[];
	/** true if this option is the currently focused option for autocomplete */
	focused?: boolean;
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-message-component-data-structure */
export interface DiscordMessageComponentInteractionData {
	/** the custom_id of the component */
	custom_id: string;
	/** the type of the component */
	component_type: MessageComponentTypes;
}

export interface DiscordMessageSelectMenuInteractionData extends DiscordMessageComponentInteractionData {
	component_type: MessageComponentTypes.SelectMenu;
	/**	values the user selected in a select menu component */
	values: DiscordSelectMenuOption[];
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-modal-submit-data-structure */
export interface DIscordModalSubmitData {
	custom_id: string;
	components: DiscordMessageComponents;
}

// TODO object types
/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure */
export interface DiscordInteractionCommandDataResolved {
	/** the ids and User objects */
	users?: Record<Snowflake, DiscordUser>;
	/** the ids and partial Member objects */
	members?: Record<string, any>;
	/** the ids and Role objects */
	roles?: Record<string, any>;
	/** the ids and partial Channel objects */
	channels?: Record<string, any>;
	/** the ids and partial Message objects */
	messages?: Record<string, any>;
	/** the ids and attachment objects */
	attachments?: Record<string, any>;
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-response-structure */
export interface DiscordInteractionResponse {
	/** the type of response */
	type: InteractionResponseTypes;
}

export interface DiscordInteractionMessageResponse extends DiscordInteractionResponse {
    type: InteractionResponseTypes.ChannelMessageWithSource | InteractionResponseTypes.UpdateMessage;
	/** an optional response message */
	data: DiscordInteractionMessages;
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete */
export interface DiscordinteractionAutoCompleteResponse extends DiscordInteractionResponse {
    type: InteractionResponseTypes.ApplicationCommandAutocompleteResult;
    /** autocomplete choices (max of 25 choices) */
	choices: ApplicationCommandOptionChoice[];
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal */
export interface DiscordInteractionModalResponse extends DiscordInteractionResponse {
    type: InteractionResponseTypes.Modal;
    /** a developer-defined identifier for the component, max 100 characters */
    custom_id: string;
    /**	the title of the popup modal, max 45 characters */
    title: string;
    /**
     * between 1 and 5 (inclusive) components that make up the modal
     * Support for components in modals is currently limited to type 4 (Text Input).
     */
    components: DiscordTextInput[];
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-messages */
export interface DiscordInteractionMessages {
	/**	is the response TTS */
	tts?: boolean;
	/** message content */
	content?: string;
	/** supports up to 10 embeds */
	embeds?: any[];
	/** allowed mentions object */
	allowed_mentions: Record<string, any[]>;
	/** message flags combined as a bitfield  */
	flags?: 64 | 4;
	/** message components */
	components?: DiscordActionRowComponent[];
	/** attachment objects with filename and description */
	attachments?: Partial<any>[];
}

/** @link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type */
export enum InteractionResponseTypes {
	/** ACK a `Ping` */
	Pong = 1,
	/** Respond to an interaction with a message */
	ChannelMessageWithSource = 4,
	/** ACK an interaction and edit a response later, the user sees a loading state */
	DeferredChannelMessageWithSource = 5,
	/** For components, ACK an interaction and edit the original message later; the user does not see a loading state */
	DeferredUpdateMessage = 6,
	/** For components, edit the message the component was attached to */
	UpdateMessage = 7,
	/** For Application Command Options, send an autocomplete result */
	ApplicationCommandAutocompleteResult = 8,
	/** For Command or Component interactions, send a Modal response */
	Modal = 9,
}
