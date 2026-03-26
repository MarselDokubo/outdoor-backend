import type { EngagementTargetType } from "../../../domain/engagement/engagement.enums.js";
import type { ImpressionSummaryView } from "../impression.contracts.js";

export interface ImpressionQueryService {
  getSummary(input: {
    targetType: EngagementTargetType;
    targetId: string;
    actorUserId: string | null;
    sessionKey: string | null;
  }): Promise<ImpressionSummaryView>;
}

export interface ImpressionTargetAccessService {
  assertTargetViewable(input: {
    actorUserId: string | null;
    targetType: EngagementTargetType;
    targetId: string;
  }): Promise<void>;
}
