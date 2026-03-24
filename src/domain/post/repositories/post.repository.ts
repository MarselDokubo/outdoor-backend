import type { Post } from "../post.js";

export interface PostRepository {
  findById(postId: string): Promise<Post | null>;
  save(post: Post): Promise<void>;
}
