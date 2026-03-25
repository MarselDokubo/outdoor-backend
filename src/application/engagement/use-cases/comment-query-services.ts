import type { EngagementTargetType } from "../../../domain/engagement/engagement.enums.js";
import type { CommentView } from "../comment.contracts.js";

export interface CommentQueryService {
  getById(commentId: string): Promise<CommentView | null>;
  listForTarget(targetType: EngagementTargetType, targetId: string): Promise<CommentView[]>;
  listByAuthor(userId: string): Promise<CommentView[]>;
}

export interface CommentTargetAccessService {
  assertTargetViewable(input: {
    actorUserId?: string | null;
    targetType: EngagementTargetType;
    targetId: string;
  }): Promise<void>;
}
