import type { DiscordPartialEmoji } from './common';

export interface BaseComponent {
	/** type of the component */
	type: MessageComponentTypes;
}

/** @link https://discord.com/developers/docs/interactions/message-components#action-rows */
export interface DiscordActionRow<T extends BaseComponent> extends BaseComponent {
	type: MessageComponentTypes.ActionRow;
	components: T[];
}

/** @link https://discord.com/developers/docs/interactions/message-components#buttons */
export interface DiscordButton extends BaseComponent {
	type: MessageComponentTypes.Button;
	/** one of button styles */
	style: ButtonStyles;
	/**	text that appears on the button, max 80 characters */
	label?: string;
	/** name, id, and animated */
	emoji?: DiscordPartialEmoji;
	/** a developer-defined identifier for the button, max 100 characters */
	custom_id?: string;
	/**	whether the button is disabled (default false) */
	disabled?: boolean;
}

export interface DiscordButtonLink extends Omit<DiscordButton, 'custom_id'> {
	/** a url for link-style buttons */
	url?: string;
}

/** @link https://discord.com/developers/docs/interactions/message-components#select-menu-object */
export interface DiscordSelectMenu extends BaseComponent {
    type: MessageComponentTypes.SelectMenu;
    /** a developer-defined identifier for the select menu, max 100 characters */
    custom_id: string;
    /** the choices in the select, max 25 */
    options: DiscordSelectMenuOption[];
    /** custom placeholder text if nothing is selected, max 150 characters */
    placeholder?: string;
    /** the minimum number of items that must be chosen; default 1, min 0*/
    min_values?: number;
    /** 	the maximum number of items that can be chosen; default 1, max 25 */
    max_values?: number;
    /** disable the select, default false */
    disabled?: boolean;

}

/** @link https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure */
export interface DiscordSelectMenuOption {
    /** the user-facing name of the option, max 100 characters */
    label: string;
    /** the dev-defined value of the option, max 100 characters */
    value: string;
    /** an additional description of the option, max 100 characters */
    description?: string;
    /** id, name, and animated */
    emoji?: DiscordPartialEmoji;
    /** will render this option as selected by default */
    default?: boolean;
}

/** @link https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure */
export interface DiscordTextInput extends BaseComponent {
    type: MessageComponentTypes.TextInput;
    /** a developer-defined identifier for the input, max 100 characters */
    custom_id?: string;
    /** the Text Input Style */
    style: TextInputStyles;
    /** the label for this component, max 45 characters */
    label: string;
    /** the minimum input length for a text input, min 0, max 4000 */
    min_length?: number;
    /** the maximum input length for a text input, min 1, max 4000 */
    max_length?: number;
    /** whether this component is required to be filled, default true */
    required?: boolean;
    /**	a pre-filled value for this component, max 4000 characters */
    value?: string;
    /** custom placeholder text if the input is empty, max 100 characters */
    placeholder?: string;
}

export type DiscordMessageComponentsWithoutRow = DiscordButton | DiscordSelectMenu | DiscordTextInput;

export type DiscordActionRowComponent = DiscordActionRow<DiscordMessageComponentsWithoutRow>;

export type DiscordMessageComponents =  DiscordActionRowComponent | DiscordButton | DiscordSelectMenu | DiscordTextInput;

/** @link https://discord.com/developers/docs/interactions/message-components#component-types */
export enum MessageComponentTypes {
	/** A container for other components */
	ActionRow = 1,
	/** A button object */
	Button,
	/** A select menu for picking from choices */
	SelectMenu,
	/** A text input object */
	TextInput,
}

/** @link https://discord.com/developers/docs/interactions/message-components#button-object-button-styles */
export enum ButtonStyles {
	/** blurple */
	Primary = 1,
	/** grey */
	Secondary,
	/** green */
	Success,
	/** red */
	Danger,
	/** grey, navigates to a URL */
	Link,
}

/** @link https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-styles */
export enum TextInputStyles {
    /** A single-line input */
    Short = 1,
    /** A multi-line input */
    Paragraph
}
