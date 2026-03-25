import type { EngagementTargetType } from "./engagement.enums.js";
import type { CommentStatus } from "./comment.enums.js";
import { CommentAccessDeniedError, CommentValidationError } from "./comment.errors.js";

export interface CommentProps {
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

export interface CreateCommentProps {
  id: string;
  authorUserId: string;
  targetType: EngagementTargetType;
  targetId: string;
  body: string;
}

export class Comment {
  private constructor(private props: CommentProps) {}

  public static create(props: CreateCommentProps): Comment {
    const now = new Date();
    const body = normalizeBody(props.body);

    return new Comment({
      id: props.id,
      authorUserId: props.authorUserId,
      targetType: props.targetType,
      targetId: props.targetId,
      body,
      status: "ACTIVE",
      editedAt: null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static rehydrate(props: CommentProps): Comment {
    return new Comment({ ...props });
  }

  public update(actorUserId: string, body: string): void {
    this.assertAuthor(actorUserId);
    this.assertActive();

    this.props = {
      ...this.props,
      body: normalizeBody(body),
      editedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public delete(actorUserId: string): void {
    this.assertAuthor(actorUserId);

    if (this.props.status === "DELETED") {
      return;
    }

    const now = new Date();
    this.props = {
      ...this.props,
      status: "DELETED",
      deletedAt: now,
      updatedAt: now,
    };
  }

  public isDeleted(): boolean {
    return this.props.status === "DELETED";
  }

  public isAuthoredBy(userId: string): boolean {
    return this.props.authorUserId === userId;
  }

  public toObject(): CommentProps {
    return { ...this.props };
  }

  private assertAuthor(actorUserId: string): void {
    if (this.props.authorUserId !== actorUserId) {
      throw new CommentAccessDeniedError("Only the author can manage this comment.");
    }
  }

  private assertActive(): void {
    if (this.props.status === "DELETED") {
      throw new CommentValidationError("Deleted comments cannot be modified.");
    }
  }
}

function normalizeBody(value: string): string {
  const normalized = value.trim();

  if (normalized.length < 1) {
    throw new CommentValidationError("Comment body is required.");
  }

  if (normalized.length > 2000) {
    throw new CommentValidationError("Comment body must not exceed 2000 characters.");
  }

  return normalized;
}
