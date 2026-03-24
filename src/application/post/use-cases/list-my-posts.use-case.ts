import type { ListMyPostsQuery, PostListResult } from "../contracts.js";
import type { PostQueryService } from "./query-services.js";

export class ListMyPostsUseCase {
  constructor(private readonly postQueryService: PostQueryService) {}

  public async execute(query: ListMyPostsQuery): Promise<PostListResult> {
    return this.postQueryService.listMyPosts(query.actorUserId, query.limit, query.cursor);
  }
}
