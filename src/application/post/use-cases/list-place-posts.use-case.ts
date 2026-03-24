import type { ListPlacePostsQuery, PostListResult } from "../contracts.js";
import type { PostQueryService } from "./query-services.js";

export class ListPlacePostsUseCase {
  constructor(private readonly postQueryService: PostQueryService) {}

  public async execute(query: ListPlacePostsQuery): Promise<PostListResult> {
    return this.postQueryService.listPlacePosts(query.placeId, query.limit, query.cursor);
  }
}
