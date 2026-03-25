import type { CommentQueryService } from "../../../application/engagement/use-cases/comment-query-services.js";
import type { CommentView } from "../../../application/engagement/comment.contracts.js";
import type { EngagementTargetType } from "../../../domain/engagement/engagement.enums.js";
import type { CommentPrismaClient } from "./comment-prisma.types.js";

interface CommentRow {
  id: string;
  authorUserId: string;
  targetType: EngagementTargetType;
  targetId: string;
  body: string;
  status: "ACTIVE" | "DELETED";
  editedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaCommentQueryService implements CommentQueryService {
  constructor(private readonly prisma: CommentPrismaClient) {}

  public async getById(commentId: string): Promise<CommentView | null> {
    const record = (await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorUserId: true,
        targetType: true,
        targetId: true,
        body: true,
        status: true,
        editedAt: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as CommentRow | null;

    return record ? toView(record) : null;
  }

  public async listForTarget(
    targetType: EngagementTargetType,
    targetId: string,
  ): Promise<CommentView[]> {
    const records = (await this.prisma.comment.findMany({
      where: {
        targetType,
        targetId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        authorUserId: true,
        targetType: true,
        targetId: true,
        body: true,
        status: true,
        editedAt: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as CommentRow[];

    return records.map(toView);
  }

  public async listByAuthor(userId: string): Promise<CommentView[]> {
    const records = (await this.prisma.comment.findMany({
      where: {
        authorUserId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        authorUserId: true,
        targetType: true,
        targetId: true,
        body: true,
        status: true,
        editedAt: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as CommentRow[];

    return records.map(toView);
  }
}

function toView(record: CommentRow): CommentView {
  return {
    id: record.id,
    authorUserId: record.authorUserId,
    targetType: record.targetType,
    targetId: record.targetId,
    body: record.status === "DELETED" ? null : record.body,
    status: record.status,
    editedAt: record.editedAt?.toISOString() ?? null,
    deletedAt: record.deletedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
