// TODO: WAITING OTHER OBJECTS

import type { DiscordApplicationCommand } from './application-command';

 /** @link https://discord.com/developers/docs/resources/audit-log#audit-log-object */
export interface DiscordAuditLog {
    /** List of application commands referenced in the audit log */
    application_commands: DiscordApplicationCommand[];
    /** List of audit log entries, sorted from most to least recent */
    audit_log_entries: DiscordAuditLogEntry[];

}

/** @link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-entry-structure */
export interface DiscordAuditLogEntry {
	/** ID of the affected entity (webhook, user, role, etc.) */
	target_id: string | null;
	/** Changes made to the `target_id` */
	changes?: DiscordAuditLogChange[];
	/** User or app that made the changes */
	user_id: string | null;
	/** ID of the entry */
	id: string;
	/** Type of action that occurred */
	action_type: AuditLogEvents;
	/** Additional info for certain event types */
	options?: DiscordOptionalAuditEntryInfo;
	/** Reason for the change (1-512 characters) */
	reason?: string;
}

/** @link https://discord.com/developers/docs/resources/audit-log#audit-log-change-object-audit-log-change-structure */
export type DiscordAuditLogChange =
	| {
		new_value: string;
		old_value: string;
		key:
		| 'name'
		| 'description'
		| 'discovery_splash_hash'
		| 'banner_hash'
		| 'preferred_locale'
		| 'rules_channel_id'
		| 'public_updates_channel_id'
		| 'icon_hash'
		| 'image_hash'
		| 'splash_hash'
		| 'owner_id'
		| 'region'
		| 'afk_channel_id'
		| 'vanity_url_code'
		| 'widget_channel_id'
		| 'system_channel_id'
		| 'topic'
		| 'application_id'
		| 'permissions'
		| 'allow'
		| 'deny'
		| 'code'
		| 'channel_id'
		| 'inviter_id'
		| 'nick'
		| 'avatar_hash'
		| 'id'
		| 'location'
		| 'command_id';
	}
	| {
		new_value: number;
		old_value: number;
		key:
		| 'afk_timeout'
		| 'mfa_level'
		| 'verification_level'
		| 'explicit_content_filter'
		| 'default_message_notifications'
		| 'prune_delete_days'
		| 'position'
		| 'bitrate'
		| 'rate_limit_per_user'
		| 'color'
		| 'max_uses'
		| 'uses'
		| 'max_age'
		| 'expire_behavior'
		| 'expire_grace_period'
		| 'user_limit'
		| 'privacy_level'
		| 'auto_archive_duration'
		| 'default_auto_archive_duration'
		| 'entity_type'
		| 'status'
		| 'communication_disabled_until';
	}
	| {
		new_value: Partial<any>[]; // Role
		old_value?: Partial<any>[]; // Role
		key: '$add' | '$remove';
	}
	| {
		new_value: boolean;
		old_value: boolean;
		key:
		| 'widget_enabled'
		| 'nsfw'
		| 'hoist'
		| 'mentionable'
		| 'temporary'
		| 'deaf'
		| 'mute'
		| 'enable_emoticons'
		| 'archived'
		| 'locked'
		| 'invitable';
	}
	| {
		new_value: any[]; // Overwrite
		old_value: any[]; // Overwrite
		key: 'permission_overwrites';
	}
	| {
		new_value: string | number;
		old_value: string | number;
		key: 'type';
	};

/** @link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-optional-audit-entry-info */
export interface DiscordOptionalAuditEntryInfo {
	/**
	 * Number of days after which inactive members were kicked.
	 *
	 * Event types: `MEMBER_PRUNE`
	 */
	delete_member_days: string;
	/**
	 * Number of members removed by the prune.
	 *
	 * Event types: `MEMBER_PRUNE`
	 */
	members_removed: string;
	/**
	 * Channel in which the entities were targeted.
	 *
	 * Event types: `MEMBER_MOVE`, `MESSAGE_PIN`, `MESSAGE_UNPIN`, `MESSAGE_DELETE`, `STAGE_INSTANCE_CREATE`, `STAGE_INSTANCE_UPDATE`, `STAGE_INSTANCE_DELETE`
	 */
	channel_id: string;
	/**
	 * ID of the message that was targeted.
	 *
	 * Event types: `MESSAGE_PIN`, `MESSAGE_UNPIN`, `STAGE_INSTANCE_CREATE`, `STAGE_INSTANCE_UPDATE`, `STAGE_INSTANCE_DELETE`
	 */
	message_id: string;
	/**
	 * Number of entities that were targeted.
	 *
	 * Event types: `MESSAGE_DELETE`, `MESSAGE_BULK_DELETE`, `MEMBER_DISCONNECT`, `MEMBER_MOVE`
	 */
	count: string;
	/**
	 * ID of the overwritten entity.
	 *
	 * Event types: `CHANNEL_OVERWRITE_CREATE`, `CHANNEL_OVERWRITE_UPDATE`, `CHANNEL_OVERWRITE_DELETE`
	 */
	id: string;
	/**
	 * Type of overwritten entity - "0", for "role", or "1" for "member".
	 *
	 * Event types: `CHANNEL_OVERWRITE_CREATE`, `CHANNEL_OVERWRITE_UPDATE`, `CHANNEL_OVERWRITE_DELETE`
	 */
	type: string;
	/**
	 * Name of the role if type is "0" (not present if type is "1").
	 *
	 * Event types: `CHANNEL_OVERWRITE_CREATE`, `CHANNEL_OVERWRITE_UPDATE`, `CHANNEL_OVERWRITE_DELETE`
	 */
	role_name: string;
	/**
	 * ID of the app whose permissions were targeted.
	 *
	 * Event types: `APPLICATION_COMMAND_PERMISSION_UPDATE`
	 */
	application_id: string;
}


/** @link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events */
export enum AuditLogEvents {
	/** Server settings were updated */
	GuildUpdate = 1,
	/** Channel was created */
	ChannelCreate = 10,
	/** Channel settings were updated */
	ChannelUpdate,
	/** Channel was deleted */
	ChannelDelete,
	/** Permission overwrite was added to a channel */
	ChannelOverwriteCreate,
	/** Permission overwrite was updated for a channel */
	ChannelOverwriteUpdate,
	/** Permission overwrite was deleted from a channel */
	ChannelOverwriteDelete,
	/** Member was removed from server */
	MemberKick = 20,
	/** Members were pruned from server */
	MemberPrune,
	/** Member was banned from server */
	MemberBanAdd,
	/** Server ban was lifted for a member */
	MemberBanRemove,
	/** Member was updated in server */
	MemberUpdate,
	/** Member was added or removed from a role */
	MemberRoleUpdate,
	/** Member was moved to a different voice channel */
	MemberMove,
	/** Member was disconnected from a voice channel */
	MemberDisconnect,
	/** Bot user was added to server */
	BotAdd,
	/** Role was created */
	RoleCreate = 30,
	/** Role was edited */
	RoleUpdate,
	/** Role was deleted */
	RoleDelete,
	/** Server invite was created */
	InviteCreate = 40,
	/** Server invite was updated */
	InviteUpdate,
	/** Server invite was deleted */
	InviteDelete,
	/** Webhook was created */
	WebhookCreate = 50,
	/** Webhook properties or channel were updated */
	WebhookUpdate,
	/** Webhook was deleted */
	WebhookDelete,
	/** Emoji was created */
	EmojiCreate = 60,
	/** Emoji name was updated */
	EmojiUpdate,
	/** Emoji was deleted */
	EmojiDelete,
	/** Single message was deleted */
	MessageDelete = 72,
	/** Multiple messages were deleted */
	MessageBulkDelete,
	/** Messaged was pinned to a channel */
	MessagePin,
	/** Message was unpinned from a channel */
	MessageUnpin,
	/** App was added to server */
	IntegrationCreate = 80,
	/** App was updated (as an example, its scopes were updated) */
	IntegrationUpdate,
	/** App was removed from server */
	IntegrationDelete,
	/** Stage instance was created (stage channel becomes live) */
	StageInstanceCreate,
	/** Stage instace details were updated */
	StageInstanceUpdate,
	/** Stage instance was deleted (stage channel no longer live) */
	StageInstanceDelete,
	/** Sticker was created */
	StickerCreate = 90,
	/** Sticker details were updated */
	StickerUpdate,
	/** Sticker was deleted */
	StickerDelete,
	/** Event was created */
	GuildScheduledEventCreate = 100,
	/** Event was updated */
	GuildScheduledEventUpdate,
	/** Event was cancelled */
	GuildScheduledEventDelete,
	/** Thread was created in a channel */
	ThreadCreate = 110,
	/** Thread was updated */
	ThreadUpdate,
	/** Thread was deleted */
	ThreadDelete,
	/** Permissions were updated for a command */
	ApplicationCommandPermissionUpdate = 121,
	/** Auto moderation rule was created */
	AutoModerationRuleCreate = 140,
	/** Auto moderation rule was updated */
	AutoModerationRuleUpdate,
	/** Auto moderation rule was deleted */
	AutoModerationRuleDelete,
	/** Message was blocked by AutoMod according to a rule. */
	AutoModerationBlockMessage,
}
