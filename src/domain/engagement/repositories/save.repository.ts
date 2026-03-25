import type { EngagementTargetType } from "../engagement.enums.js";
import type { Save } from "../save.js";

export interface SaveRepository {
  findByUserAndTarget(
    userId: string,
    targetType: EngagementTargetType,
    targetId: string,
  ): Promise<Save | null>;

  save(item: Save): Promise<void>;

  deleteByUserAndTarget(
    userId: string,
    targetType: EngagementTargetType,
    targetId: string,
  ): Promise<void>;
}
