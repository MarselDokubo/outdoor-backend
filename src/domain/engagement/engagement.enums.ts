export const ENGAGEMENT_TARGET_TYPES = ["PLACE", "POST", "EVENT"] as const;
export type EngagementTargetType = (typeof ENGAGEMENT_TARGET_TYPES)[number];

export const REACTION_TYPES = ["LIKE", "INTERESTED", "FIRE"] as const;
export type ReactionType = (typeof REACTION_TYPES)[number];
