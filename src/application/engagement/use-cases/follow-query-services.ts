import type { FollowSummaryView, ListMyFollowsResult } from "../follow.contracts.js";
import type { FollowTargetType } from "../../../domain/engagement/follow.enums.js";

export interface FollowQueryService {
  getUserSummary(input: {
    actorUserId?: string | null;
    userId: string;
  }): Promise<FollowSummaryView>;
  getPlaceSummary(input: {
    actorUserId?: string | null;
    placeId: string;
  }): Promise<FollowSummaryView>;
  listByFollowerUserId(input: {
    followerUserId: string;
    targetType?: FollowTargetType;
    limit: number;
    cursor?: string | null;
  }): Promise<ListMyFollowsResult>;
}

export interface FollowTargetAccessService {
  assertTargetFollowable(input: {
    actorUserId: string;
    targetType: FollowTargetType;
    targetId: string;
  }): Promise<void>;
  assertUserExists(userId: string): Promise<void>;
  assertPlaceViewable(placeId: string, actorUserId?: string | null): Promise<void>;
}
