import type { FollowTargetType } from "../../domain/engagement/follow.enums.js";

export interface FollowView {
  id: string;
  followerUserId: string;
  targetType: FollowTargetType;
  targetId: string;
  createdAt: string;
}

export interface FollowSummaryView {
  targetType: FollowTargetType;
  targetId: string;
  followersCount: number;
  isFollowing: boolean;
  followingCount: number | null;
}

export interface FollowTargetCommand {
  actorUserId: string;
  targetType: FollowTargetType;
  targetId: string;
}

export interface UnfollowTargetCommand {
  actorUserId: string;
  targetType: FollowTargetType;
  targetId: string;
}

export interface ListMyFollowsQuery {
  actorUserId: string;
  targetType?: FollowTargetType;
  limit?: number;
  cursor?: string | null;
}

export interface ListMyFollowsResult {
  items: FollowView[];
  nextCursor: string | null;
}

export interface GetUserFollowSummaryQuery {
  actorUserId?: string | null;
  userId: string;
}

export interface GetPlaceFollowSummaryQuery {
  actorUserId?: string | null;
  placeId: string;
}
