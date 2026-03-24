import type { PostRepository } from "../../../domain/post/repositories/index.js";
import type { Post } from "../../../domain/post/post.js";
import type { PostPrismaClient, PostPrismaTransactionClient } from "./post-prisma.types.js";
import { toPostEntity, toPostPersistence } from "./post-mappers.js";

type PrismaDb = PostPrismaClient | PostPrismaTransactionClient;

export class PrismaPostRepository implements PostRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findById(postId: string): Promise<Post | null> {
    const record = await this.db.post.findUnique({ where: { id: postId } });
    return record ? toPostEntity(record) : null;
  }

  public async save(post: Post): Promise<void> {
    const data = toPostPersistence(post);

    await this.db.post.upsert({
      where: { id: data.id },
      update: {
        body: data.body,
        visibility: data.visibility,
        publicationStatus: data.publicationStatus,
        updatedAt: data.updatedAt,
        publishedAt: data.publishedAt,
        archivedAt: data.archivedAt,
      },
      create: data,
    });
  }
}
