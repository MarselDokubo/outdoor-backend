import type { EngagementTargetType } from "../engagement.enums.js";
import type { Reaction } from "../reaction.js";

export interface ReactionRepository {
  findByUserAndTarget(
    userId: string,
    targetType: EngagementTargetType,
    targetId: string,
  ): Promise<Reaction | null>;

  save(reaction: Reaction): Promise<void>;

  deleteByUserAndTarget(
    userId: string,
    targetType: EngagementTargetType,
    targetId: string,
  ): Promise<void>;
}
