import type { GetImpressionSummaryQuery, ImpressionSummaryView } from "../impression.contracts.js";
import type {
  ImpressionQueryService,
  ImpressionTargetAccessService,
} from "./impression-query-services.js";

export class GetImpressionSummaryUseCase {
  constructor(
    private readonly queryService: ImpressionQueryService,
    private readonly targetAccessService: ImpressionTargetAccessService,
  ) {}

  public async execute(query: GetImpressionSummaryQuery): Promise<ImpressionSummaryView> {
    const actorUserId = query.actorUserId ?? null;
    const sessionKey = query.sessionKey ?? null;

    await this.targetAccessService.assertTargetViewable({
      actorUserId,
      targetType: query.targetType,
      targetId: query.targetId,
    });

    return this.queryService.getSummary({
      targetType: query.targetType,
      targetId: query.targetId,
      actorUserId,
      sessionKey,
    });
  }
}
