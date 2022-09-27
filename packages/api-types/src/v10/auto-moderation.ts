import type { Snowflake, DiscordBase } from './common';


/** @link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-auto-moderation-rule-structure */
export interface DiscordAutoModerationRule extends DiscordBase {
    /**	the id of the guild which this rule belongs to */
    guild_id: Snowflake;
    /** the rule name */
    name: string;
    /** the user which first created this rule */
    creator_id: Snowflake;
    /** the rule event type */
    event_type: AutoModerationEventTypes;
    /** the rule trigger type */
    trigger_type: AutoModerationTriggerTypes;
    /**	the rule trigger metadata */
    trigger_metadata: AutoModerationTriggerMetadata;
    /** the actions which will execute when the rule is triggered */
    actions: AutoModerationAction[];
    /**	whether the rule is enabled */
    enabled: boolean;
    /** the role ids that should not be affected by the rule (Maximum of 20) */
    exempt_roles: Snowflake[];
    /**	the channel ids that should not be affected by the rule (Maximum of 50) */
    exempt_channels: Snowflake[];
}

/** @link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-auto-moderation-action-structure */
export interface AutoModerationAction {
    /** the type of action */
    type: AutoModerationActionTypes;
    /**	additional metadata needed during execution for this specific action type */
    metadata?: AutoModerationActionMetadata;
}

/** @link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-action-types */
export enum AutoModerationActionTypes {
    /** blocks the content of a message according to the rule */
    BLOCK_MESSAGE = 1,
    /**	logs user content to a specified channel */
    SEND_ALERT_MESSAGE,
    /**	timeout user for a specified duration */
    TIMEOUT,
}

/** @link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-action-metadata */
export interface AutoModerationActionMetadata {
    /** channel to which user content should be logged */
    channel_id: Snowflake;
    /** timeout duration in seconds. Maximum of 2419200 seconds (4 weeks) */
    duration_seconds: number;
}

/** @link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-metadata */
export interface AutoModerationTriggerMetadata {
    /** substrings which will be searched for in content */
    keyword_filter: string[];
    /** the internally pre-defined wordsets which will be searched for in content */
    presents: AutoModerationKeywordPresetTypes[];
    /** substrings which will be exempt from triggering the preset trigger type */
    allow_list: string[];
    /** total number of mentions (role & user) allowed per message (Maximum of 50) */
    mention_total_spam: number;
}

/** @link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-preset-types */
export enum AutoModerationKeywordPresetTypes {
    /**	Words that may be considered forms of swearing or cursin */
    PROFANITY = 1,
    /** Words that refer to sexually explicit behavior or activity */
    SEXUAL_CONTENT,
    /** Personal insults or words that may be considered hate speech */
    SLURS,
}

/** @link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types */
export enum AutoModerationTriggerTypes {
    /** check if content contains words from a user defined list of keywords */
    KEYWORD = 1,
    /** check if content represents generic spam */
    SPAM = 3,
    /**	check if content contains words from internal pre-defined wordsets*/
    KEYWORD_PRESET = 4,
    /** check if content contains more mentions than allowed */
    MENTION_SPAM = 5
}

/** @link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-event-types */
export enum AutoModerationEventTypes {
    MESSAGE_SEND = 1,
}
