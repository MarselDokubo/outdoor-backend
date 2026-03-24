import { CreatePostUseCase } from "./use-cases/create-post.use-case.js";
import { UpdatePostUseCase } from "./use-cases/update-post.use-case.js";
import { PublishPostUseCase } from "./use-cases/publish-post.use-case.js";
import { ArchivePostUseCase } from "./use-cases/archive-post.use-case.js";
import { GetPostDetailsUseCase } from "./use-cases/get-post-details.use-case.js";
import { ListPlacePostsUseCase } from "./use-cases/list-place-posts.use-case.js";
import { ListMyPostsUseCase } from "./use-cases/list-my-posts.use-case.js";
import { PrismaPostRepository } from "../../infrastructure/persistence/prisma/prisma-post.repository.js";
import { PrismaPostQueryService } from "../../infrastructure/persistence/prisma/prisma-post-query.repository.js";
import { PrismaPlaceRepository } from "../../infrastructure/persistence/prisma/prisma-place.repository.js";
import type { PostPrismaClient } from "../../infrastructure/persistence/prisma/post-prisma.types.js";

export function buildPostModule(prisma: PostPrismaClient) {
  const postRepository = new PrismaPostRepository(prisma);
  const postQueryService = new PrismaPostQueryService(prisma);
  const placeRepository = new PrismaPlaceRepository(prisma);

  return {
    createPost: new CreatePostUseCase(postRepository, placeRepository),
    updatePost: new UpdatePostUseCase(postRepository),
    publishPost: new PublishPostUseCase(postRepository),
    archivePost: new ArchivePostUseCase(postRepository),
    getPostDetails: new GetPostDetailsUseCase(postQueryService),
    listPlacePosts: new ListPlacePostsUseCase(postQueryService),
    listMyPosts: new ListMyPostsUseCase(postQueryService),
  };
}
