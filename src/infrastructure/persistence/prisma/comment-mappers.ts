import { Comment } from "../../../domain/engagement/comment.js";
import type { EngagementTargetType } from "../../../domain/engagement/engagement.enums.js";
import type { CommentStatus } from "../../../domain/engagement/comment.enums.js";

export interface CommentRecord {
  id: string;
  authorUserId: string;
  targetType: EngagementTargetType;
  targetId: string;
  body: string;
  status: CommentStatus;
  editedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toCommentPersistence(comment: Comment): CommentRecord {
  const data = comment.toObject();

  return {
    id: data.id,
    authorUserId: data.authorUserId,
    targetType: data.targetType,
    targetId: data.targetId,
    body: data.body,
    status: data.status,
    editedAt: data.editedAt,
    deletedAt: data.deletedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function toCommentEntity(record: CommentRecord): Comment {
  return Comment.rehydrate({
    id: record.id,
    authorUserId: record.authorUserId,
    targetType: record.targetType,
    targetId: record.targetId,
    body: record.body,
    status: record.status,
    editedAt: record.editedAt,
    deletedAt: record.deletedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}
