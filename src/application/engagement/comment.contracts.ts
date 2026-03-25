import type { EngagementTargetType } from "../../domain/engagement/engagement.enums.js";
import type { CommentStatus } from "../../domain/engagement/comment.enums.js";

export interface CreateCommentCommand {
  actorUserId: string;
  targetType: EngagementTargetType;
  targetId: string;
  body: string;
}

export interface UpdateCommentCommand {
  actorUserId: string;
  commentId: string;
  body: string;
}

export interface DeleteCommentCommand {
  actorUserId: string;
  commentId: string;
}

export interface GetCommentDetailsQuery {
  actorUserId?: string | null;
  commentId: string;
}

export interface ListTargetCommentsQuery {
  actorUserId?: string | null;
  targetType: EngagementTargetType;
  targetId: string;
}

export interface ListMyCommentsQuery {
  actorUserId: string;
}

export interface CommentView {
  id: string;
  authorUserId: string;
  targetType: EngagementTargetType;
  targetId: string;
  body: string | null;
  status: CommentStatus;
  editedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentListView {
  items: CommentView[];
}
