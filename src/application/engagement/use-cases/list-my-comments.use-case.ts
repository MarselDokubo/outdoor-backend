import type { CommentListView, ListMyCommentsQuery } from "../comment.contracts.js";
import type { CommentQueryService } from "./comment-query-services.js";

export class ListMyCommentsUseCase {
  constructor(private readonly queryService: CommentQueryService) {}

  public async execute(query: ListMyCommentsQuery): Promise<CommentListView> {
    return {
      items: await this.queryService.listByAuthor(query.actorUserId),
    };
  }
}
