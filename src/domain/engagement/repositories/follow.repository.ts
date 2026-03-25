import type { Follow } from "../follow.js";
import type { FollowTargetType } from "../follow.enums.js";

export interface FollowRepository {
  findByFollowerAndTarget(
    followerUserId: string,
    targetType: FollowTargetType,
    targetId: string,
  ): Promise<Follow | null>;
  save(follow: Follow): Promise<void>;
  deleteByFollowerAndTarget(
    followerUserId: string,
    targetType: FollowTargetType,
    targetId: string,
  ): Promise<void>;
}
