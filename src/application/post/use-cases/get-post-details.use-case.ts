import { PostNotFoundError } from "../../../domain/post/post.errors.js";
import type { GetPostDetailsQuery, PostView } from "../contracts.js";
import type { PostQueryService } from "./query-services.js";

export class GetPostDetailsUseCase {
  constructor(private readonly postQueryService: PostQueryService) {}

  public async execute(query: GetPostDetailsQuery): Promise<PostView> {
    const post = await this.postQueryService.getPostDetails(query.postId, query.actorUserId);

    if (!post) {
      throw new PostNotFoundError();
    }

    return post;
  }
}
