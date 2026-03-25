export const FOLLOW_TARGET_TYPES = ["USER", "PLACE"] as const;

export type FollowTargetType = (typeof FOLLOW_TARGET_TYPES)[number];
