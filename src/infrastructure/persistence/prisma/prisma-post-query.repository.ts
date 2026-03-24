import type { PostListResult, PostView } from "../../../application/post/contracts.js";
import type { PostQueryService } from "../../../application/post/use-cases/query-services.js";
import type { PostPrismaClient } from "./post-prisma.types.js";
import { toPostView } from "./post-mappers.js";
import type { Post as PrismaPost } from "../../../generated/prisma/client.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export class PrismaPostQueryService implements PostQueryService {
  constructor(private readonly prisma: PostPrismaClient) {}

  public async getPostDetails(postId: string, actorUserId?: string): Promise<PostView | null> {
    const record = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!record) {
      return null;
    }

    const isAuthor = actorUserId ? record.authorUserId === actorUserId : false;
    const isPubliclyVisible =
      record.publicationStatus === "PUBLISHED" &&
      (record.visibility === "PUBLIC" || record.visibility === "UNLISTED");

    if (!isAuthor && !isPubliclyVisible) {
      return null;
    }

    return toPostView(record);
  }

  public async listPlacePosts(
    placeId: string,
    limit?: number,
    cursor?: string,
  ): Promise<PostListResult> {
    const take = normalizeLimit(limit);
    const cursorParts = parseCursor(cursor);

    const records = await this.prisma.post.findMany({
      where: {
        placeId,
        publicationStatus: "PUBLISHED",
        visibility: "PUBLIC",
        ...(cursorParts
          ? {
              OR: [
                { createdAt: { lt: cursorParts.createdAt } },
                { createdAt: cursorParts.createdAt, id: { lt: cursorParts.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: take + 1,
    });

    return toListResult(records, take);
  }

  public async listMyPosts(
    actorUserId: string,
    limit?: number,
    cursor?: string,
  ): Promise<PostListResult> {
    const take = normalizeLimit(limit);
    const cursorParts = parseCursor(cursor);

    const records = await this.prisma.post.findMany({
      where: {
        authorUserId: actorUserId,
        ...(cursorParts
          ? {
              OR: [
                { createdAt: { lt: cursorParts.createdAt } },
                { createdAt: cursorParts.createdAt, id: { lt: cursorParts.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: take + 1,
    });

    return toListResult(records, take);
  }
}

function normalizeLimit(limit?: number): number {
  if (!limit || limit <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(limit, MAX_LIMIT);
}

function parseCursor(cursor?: string): { createdAt: Date; id: string } | null {
  if (!cursor) {
    return null;
  }

  const [createdAt, id] = cursor.split("__");

  if (!createdAt || !id) {
    return null;
  }

  return {
    createdAt: new Date(createdAt),
    id,
  };
}

function toListResult(records: PrismaPost[], take: number): PostListResult {
  const page = records.slice(0, take);
  const next = records.length > take ? records[take - 1] : null;

  return {
    items: page.map(toPostView),
    nextCursor: next ? `${next.createdAt.toISOString()}__${next.id}` : null,
  };
}
