import type { EngagementTargetType } from "../engagement.enums.js";
import type { Impression } from "../impression.js";

export interface ImpressionRepository {
  save(impression: Impression): Promise<void>;
  findRecentByViewer(input: {
    targetType: EngagementTargetType;
    targetId: string;
    viewerUserId: string;
    since: Date;
  }): Promise<Impression | null>;
  findRecentBySession(input: {
    targetType: EngagementTargetType;
    targetId: string;
    sessionKey: string;
    since: Date;
  }): Promise<Impression | null>;
}
