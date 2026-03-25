import type { FollowSummaryView, GetUserFollowSummaryQuery } from "../follow.contracts.js";
import type { FollowQueryService, FollowTargetAccessService } from "./follow-query-services.js";

export class GetUserFollowSummaryUseCase {
  constructor(
    private readonly queryService: FollowQueryService,
    private readonly targetAccessService: FollowTargetAccessService,
  ) {}

  public async execute(query: GetUserFollowSummaryQuery): Promise<FollowSummaryView> {
    await this.targetAccessService.assertUserExists(query.userId);

    return this.queryService.getUserSummary({
      userId: query.userId,
      ...(query.actorUserId !== undefined ? { actorUserId: query.actorUserId } : {}),
    });
  }
}
