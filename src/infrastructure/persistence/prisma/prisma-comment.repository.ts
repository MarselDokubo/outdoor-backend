import type { CommentRepository } from "../../../domain/engagement/repositories/comment.repository.js";
import type { Comment } from "../../../domain/engagement/comment.js";
import type {
  CommentPrismaClient,
  CommentPrismaTransactionClient,
} from "./comment-prisma.types.js";
import { toCommentEntity, toCommentPersistence } from "./comment-mappers.js";

type PrismaDb = CommentPrismaClient | CommentPrismaTransactionClient;

export class PrismaCommentRepository implements CommentRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findById(commentId: string): Promise<Comment | null> {
    const record = await this.db.comment.findUnique({
      where: { id: commentId },
    });

    return record ? toCommentEntity(record) : null;
  }

  public async save(comment: Comment): Promise<void> {
    const data = toCommentPersistence(comment);

    await this.db.comment.upsert({
      where: { id: data.id },
      update: {
        body: data.body,
        status: data.status,
        editedAt: data.editedAt,
        deletedAt: data.deletedAt,
        updatedAt: data.updatedAt,
      },
      create: data,
    });
  }
}
