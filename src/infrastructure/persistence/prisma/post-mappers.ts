import type { Post as PrismaPost } from "../../../generated/prisma/client.js";
import type { PostView } from "../../../application/post/contracts.js";
import { Post } from "../../../domain/post/post.js";

export function toPostEntity(record: PrismaPost): Post {
  return Post.rehydrate({
    id: record.id,
    authorUserId: record.authorUserId,
    placeId: record.placeId,
    body: record.body,
    visibility: record.visibility,
    publicationStatus: record.publicationStatus,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    publishedAt: record.publishedAt,
    archivedAt: record.archivedAt,
  });
}

export function toPostPersistence(post: Post) {
  return {
    id: post.id,
    authorUserId: post.authorUserId,
    placeId: post.placeId,
    body: post.body,
    visibility: post.visibility,
    publicationStatus: post.publicationStatus,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
    archivedAt: post.archivedAt,
  };
}

export function toPostView(record: PrismaPost): PostView {
  return {
    id: record.id,
    authorUserId: record.authorUserId,
    placeId: record.placeId,
    body: record.body,
    visibility: record.visibility,
    publicationStatus: record.publicationStatus,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    publishedAt: record.publishedAt ? record.publishedAt.toISOString() : null,
    archivedAt: record.archivedAt ? record.archivedAt.toISOString() : null,
  };
}
