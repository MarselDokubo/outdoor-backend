import type { ActiveVisitView, PlaceVisitSummaryView } from "../contracts.js";

export interface VisitQueryService {
  getPlaceVisitSummary(placeId: string): Promise<PlaceVisitSummaryView>;
  getActiveVisitForUser(userId: string): Promise<ActiveVisitView | null>;
}
