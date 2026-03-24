import type { PostPublicationStatus, PostVisibility } from "../../domain/post/post.enums.js";

export interface CreatePostCommand {
  actorUserId: string;
  placeId: string;
  body: string;
  visibility: PostVisibility;
}

export interface UpdatePostCommand {
  actorUserId: string;
  postId: string;
  body: string;
  visibility: PostVisibility;
}

export interface PublishPostCommand {
  actorUserId: string;
  postId: string;
}

export interface ArchivePostCommand {
  actorUserId: string;
  postId: string;
}

export interface GetPostDetailsQuery {
  actorUserId?: string | undefined;
  postId: string;
}

export interface ListPlacePostsQuery {
  placeId: string;
  limit?: number | undefined;
  cursor?: string | undefined;
}

export interface ListMyPostsQuery {
  actorUserId: string;
  limit?: number | undefined;
  cursor?: string | undefined;
}

export interface PostView {
  id: string;
  authorUserId: string;
  placeId: string;
  body: string;
  visibility: PostVisibility;
  publicationStatus: PostPublicationStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
}

export interface PostListResult {
  items: PostView[];
  nextCursor: string | null;
}
