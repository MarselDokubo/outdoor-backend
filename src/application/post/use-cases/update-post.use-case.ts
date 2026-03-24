import { PostNotFoundError } from "../../../domain/post/post.errors.js";
import type { PostRepository } from "../../../domain/post/repositories/index.js";
import type { Post } from "../../../domain/post/post.js";
import type { PostView, UpdatePostCommand } from "../contracts.js";

export class UpdatePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  public async execute(command: UpdatePostCommand): Promise<PostView> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new PostNotFoundError();
    }

    post.updateDraft(command.actorUserId, command.body, command.visibility);
    await this.postRepository.save(post);

    return toPostView(post);
  }
}

function toPostView(post: Post): PostView {
  return {
    id: post.id,
    authorUserId: post.authorUserId,
    placeId: post.placeId,
    body: post.body,
    visibility: post.visibility,
    publicationStatus: post.publicationStatus,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    archivedAt: post.archivedAt ? post.archivedAt.toISOString() : null,
  };
}
