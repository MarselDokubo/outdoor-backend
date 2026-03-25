import type { EngagementTargetType } from "../../../domain/engagement/engagement.enums.js";
import type { EngagementSummaryView, ListMySavedItemsQuery, SaveView } from "../contracts.js";

export interface EngagementQueryService {
  getSummary(input: {
    actorUserId?: string | null;
    targetType: EngagementTargetType;
    targetId: string;
  }): Promise<EngagementSummaryView>;

  listMySavedItems(input: ListMySavedItemsQuery): Promise<SaveView[]>;
}

export interface EngagementTargetAccessService {
  assertTargetViewable(input: {
    actorUserId?: string | null;
    targetType: EngagementTargetType;
    targetId: string;
  }): Promise<void>;
}
