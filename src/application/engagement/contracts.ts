import type {
  EngagementTargetType,
  ReactionType,
} from "../../domain/engagement/engagement.enums.js";

export interface ReactToTargetCommand {
  actorUserId: string;
  targetType: EngagementTargetType;
  targetId: string;
  reactionType: ReactionType;
}

export interface RemoveReactionCommand {
  actorUserId: string;
  targetType: EngagementTargetType;
  targetId: string;
}

export interface SaveTargetCommand {
  actorUserId: string;
  targetType: EngagementTargetType;
  targetId: string;
}

export interface RemoveSaveCommand {
  actorUserId: string;
  targetType: EngagementTargetType;
  targetId: string;
}

export interface GetEngagementSummaryQuery {
  actorUserId?: string | null;
  targetType: EngagementTargetType;
  targetId: string;
}

export interface ListMySavedItemsQuery {
  actorUserId: string;
  targetType?: EngagementTargetType;
}

export interface ReactionView {
  id: string;
  userId: string;
  targetType: EngagementTargetType;
  targetId: string;
  reactionType: ReactionType;
  createdAt: string;
  updatedAt: string;
}

export interface SaveView {
  id: string;
  userId: string;
  targetType: EngagementTargetType;
  targetId: string;
  createdAt: string;
}

export interface EngagementSummaryView {
  targetType: EngagementTargetType;
  targetId: string;
  totalReactions: number;
  savesCount: number;
  reactionsByType: Partial<Record<ReactionType, number>>;
  viewerReactionType: ReactionType | null;
  viewerHasSaved: boolean;
}
