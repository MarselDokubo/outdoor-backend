import type { Comment } from "../comment.js";

export interface CommentRepository {
  findById(commentId: string): Promise<Comment | null>;
  save(comment: Comment): Promise<void>;
}
