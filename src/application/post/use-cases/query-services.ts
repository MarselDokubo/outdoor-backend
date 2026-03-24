import type { PostListResult, PostView } from "../contracts.js";

export interface PostQueryService {
  getPostDetails(postId: string, actorUserId?: string): Promise<PostView | null>;
  listPlacePosts(placeId: string, limit?: number, cursor?: string): Promise<PostListResult>;
  listMyPosts(actorUserId: string, limit?: number, cursor?: string): Promise<PostListResult>;
}
