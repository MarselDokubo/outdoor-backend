import type { PlaceRepository } from "../../../domain/place/repositories/place.repository.js";
import { PostNotFoundError } from "../../../domain/post/post.errors.js";
import type { PostRepository } from "../../../domain/post/repositories/index.js";
import { Post } from "../../../domain/post/post.js";
import { newId } from "../../../shared/ids.js";
import type { CreatePostCommand, PostView } from "../contracts.js";

export class CreatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly placeRepository: PlaceRepository,
  ) {}

  public async execute(command: CreatePostCommand): Promise<PostView> {
    const place = await this.placeRepository.findById(command.placeId);

    if (!place) {
      throw new PostNotFoundError("Place not found.");
    }

    const post = Post.create({
      id: newId("post"),
      authorUserId: command.actorUserId,
      placeId: command.placeId,
      body: command.body,
      visibility: command.visibility,
    });

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
