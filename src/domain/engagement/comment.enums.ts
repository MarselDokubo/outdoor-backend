export const COMMENT_STATUSES = ["ACTIVE", "DELETED"] as const;

export type CommentStatus = (typeof COMMENT_STATUSES)[number];
