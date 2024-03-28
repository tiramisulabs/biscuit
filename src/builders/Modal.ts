import {
	type APIActionRowComponent,
	type APIModalInteractionResponseCallbackData,
	type APITextInputComponent,
	ComponentType,
	type TextInputStyle,
} from 'discord-api-types/v10';
import type { RestOrArray } from '../common';
import type { ActionRow } from './ActionRow';
import { BaseComponentBuilder, type OptionValuesLength } from './Base';
import { fromComponent } from './index';
import type { ModalBuilderComponents, ModalSubmitCallback } from './types';

/**
 * Represents a modal for user interactions.
 * @template T - The type of components allowed in the modal.
 * @example
 * const modal = new Modal();
 * modal.setTitle("Sample Modal");
 * modal.addComponents(new TextInput().setLabel("Enter text"));
 * modal.run((interaction) => {
 *   // Handle modal submission
 * });
 * const json = modal.toJSON();
 */
export class Modal<T extends ModalBuilderComponents = TextInput> {
	/** @internal */
	__exec?: ModalSubmitCallback;
	components: ActionRow<T>[] = [];

	/**
	 * Creates a new Modal instance.
	 * @param data - Optional data for the modal.
	 */
	constructor(public data: Partial<APIModalInteractionResponseCallbackData> = {}) {
		this.components = this.components.concat((data.components?.map(fromComponent) as ActionRow<T>[]) ?? []);
	}

	/**
	 * Adds components to the modal.
	 * @param components - Components to be added to the modal.
	 * @returns The current Modal instance.
	 */
	addComponents(...components: RestOrArray<ActionRow<T>>): this {
		this.components = this.components.concat(components.flat());
		return this;
	}

	/**
	 * Set the components to the modal.
	 * @param component - The components to set into the modal.
	 * @returns The current Modal instance.
	 */
	setComponents(component: ActionRow<T>[]): this {
		this.components = [...component];
		return this;
	}

	/**
	 * Sets the title of the modal.
	 * @param title - The title of the modal.
	 * @returns The current Modal instance.
	 */
	setTitle(title: string): this {
		this.data.title = title;
		return this;
	}

	/**
	 * Sets the custom ID of the modal.
	 * @param id - The custom ID for the modal.
	 * @returns The current Modal instance.
	 */
	setCustomId(id: string): this {
		this.data.custom_id = id;
		return this;
	}

	/**
	 * Sets the callback function to be executed when the modal is submitted.
	 * @param func - The callback function.
	 * @returns The current Modal instance.
	 */
	run(func: ModalSubmitCallback): this {
		this.__exec = func;
		return this;
	}

	/**
	 * Converts the modal to JSON format.
	 * @returns The modal data in JSON format.
	 */
	toJSON() {
		return {
			custom_id: this.data.custom_id,
			title: this.data.title,
			components: this.components.map(x => x.toJSON() as unknown as APIActionRowComponent<APITextInputComponent>),
		} as APIModalInteractionResponseCallbackData;
	}
}

/**
 * Represents a text input component builder.
 * @example
 * const textInput = new TextInput().setLabel("Enter text");
 * textInput.setStyle(TextInputStyle.Paragraph);
 * textInput.setPlaceholder("Type here");
 * const json = textInput.toJSON();
 */
export class TextInput extends BaseComponentBuilder<APITextInputComponent> {
	/**
	 * Creates a new TextInput instance.
	 * @param data - Optional data for the text input.
	 */
	constructor(data: Partial<APITextInputComponent> = {}) {
		super({ ...data, type: ComponentType.TextInput });
	}

	/**
	 * Sets the style of the text input.
	 * @param style - The style of the text input.
	 * @returns The current TextInput instance.
	 */
	setStyle(style: TextInputStyle): this {
		this.data.style = style;
		return this;
	}

	/**
	 * Sets the label of the text input.
	 * @param label - The label of the text input.
	 * @returns The current TextInput instance.
	 */
	setLabel(label: string): this {
		this.data.label = label;
		return this;
	}

	/**
	 * Sets the placeholder of the text input.
	 * @param placeholder - The placeholder text.
	 * @returns The current TextInput instance.
	 */
	setPlaceholder(placeholder: string): this {
		this.data.placeholder = placeholder;
		return this;
	}

	/**
	 * Sets the length constraints for the text input.
	 * @param options - The length constraints.
	 * @returns The current TextInput instance.
	 */
	setLength({ max, min }: Partial<OptionValuesLength>): this {
		this.data.max_length = max;
		this.data.min_length = min;
		return this;
	}

	/**
	 * Sets the custom ID of the text input.
	 * @param id - The custom ID for the text input.
	 * @returns The current TextInput instance.
	 */
	setCustomId(id: string): this {
		this.data.custom_id = id;
		return this;
	}

	/**
	 * Sets the initial value of the text input.
	 * @param value - The initial value.
	 * @returns The current TextInput instance.
	 */
	setValue(value: string): this {
		this.data.value = value;
		return this;
	}

	/**
	 * Sets whether the text input is required.
	 * @param required - Indicates whether the text input is required.
	 * @returns The current TextInput instance.
	 */
	setRequired(required = true): this {
		this.data.required = required;
		return this;
	}
}
