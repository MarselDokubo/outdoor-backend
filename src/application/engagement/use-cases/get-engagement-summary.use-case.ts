import type { EngagementSummaryView, GetEngagementSummaryQuery } from "../contracts.js";
import type { EngagementQueryService, EngagementTargetAccessService } from "./query-services.js";

export class GetEngagementSummaryUseCase {
  constructor(
    private readonly queryService: EngagementQueryService,
    private readonly targetAccessService: EngagementTargetAccessService,
  ) {}

  public async execute(query: GetEngagementSummaryQuery): Promise<EngagementSummaryView> {
    await this.targetAccessService.assertTargetViewable({
      targetType: query.targetType,
      targetId: query.targetId,
      ...(query.actorUserId !== undefined ? { actorUserId: query.actorUserId } : {}),
    });

    return this.queryService.getSummary(query);
  }
}
