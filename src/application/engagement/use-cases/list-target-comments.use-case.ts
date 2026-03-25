import type { ListTargetCommentsQuery, CommentListView } from "../comment.contracts.js";
import type { CommentQueryService, CommentTargetAccessService } from "./comment-query-services.js";

export class ListTargetCommentsUseCase {
  constructor(
    private readonly queryService: CommentQueryService,
    private readonly targetAccessService: CommentTargetAccessService,
  ) {}

  public async execute(query: ListTargetCommentsQuery): Promise<CommentListView> {
    await this.targetAccessService.assertTargetViewable({
      targetType: query.targetType,
      targetId: query.targetId,
      ...(query.actorUserId !== undefined ? { actorUserId: query.actorUserId } : {}),
    });

    return {
      items: await this.queryService.listForTarget(query.targetType, query.targetId),
    };
  }
}
