import type { FollowSummaryView, GetPlaceFollowSummaryQuery } from "../follow.contracts.js";
import type { FollowQueryService, FollowTargetAccessService } from "./follow-query-services.js";

export class GetPlaceFollowSummaryUseCase {
  constructor(
    private readonly queryService: FollowQueryService,
    private readonly targetAccessService: FollowTargetAccessService,
  ) {}

  public async execute(query: GetPlaceFollowSummaryQuery): Promise<FollowSummaryView> {
    await this.targetAccessService.assertPlaceViewable(query.placeId, query.actorUserId);

    return this.queryService.getPlaceSummary({
      placeId: query.placeId,
      ...(query.actorUserId !== undefined ? { actorUserId: query.actorUserId } : {}),
    });
  }
}
