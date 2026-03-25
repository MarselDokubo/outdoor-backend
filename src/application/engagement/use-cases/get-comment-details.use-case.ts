import { CommentNotFoundError } from "../../../domain/engagement/comment.errors.js";
import type { GetCommentDetailsQuery, CommentView } from "../comment.contracts.js";
import type { CommentQueryService, CommentTargetAccessService } from "./comment-query-services.js";

export class GetCommentDetailsUseCase {
  constructor(
    private readonly queryService: CommentQueryService,
    private readonly targetAccessService: CommentTargetAccessService,
  ) {}

  public async execute(query: GetCommentDetailsQuery): Promise<CommentView> {
    const comment = await this.queryService.getById(query.commentId);

    if (!comment) {
      throw new CommentNotFoundError();
    }

    await this.targetAccessService.assertTargetViewable({
      targetType: comment.targetType,
      targetId: comment.targetId,
      ...(query.actorUserId !== undefined ? { actorUserId: query.actorUserId } : {}),
    });

    return comment;
  }
}
