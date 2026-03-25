import type { EngagementQueryService } from "../../../application/engagement/use-cases/query-services.js";
import type {
  EngagementSummaryView,
  ListMySavedItemsQuery,
  SaveView,
} from "../../../application/engagement/contracts.js";
import type { ReactionType } from "../../../domain/engagement/engagement.enums.js";
import type { EngagementPrismaClient } from "./engagement-prisma.types.js";

export class PrismaEngagementQueryService implements EngagementQueryService {
  constructor(private readonly prisma: EngagementPrismaClient) {}

  public async getSummary(input: {
    actorUserId?: string | null;
    targetType: "PLACE" | "POST" | "EVENT";
    targetId: string;
  }): Promise<EngagementSummaryView> {
    const [groupedReactions, totalReactions, savesCount, viewerReaction, viewerSave] =
      await Promise.all([
        this.prisma.reaction.groupBy({
          by: ["reactionType"],
          where: {
            targetType: input.targetType,
            targetId: input.targetId,
          },
          _count: {
            _all: true,
          },
        }),
        this.prisma.reaction.count({
          where: {
            targetType: input.targetType,
            targetId: input.targetId,
          },
        }),
        this.prisma.save.count({
          where: {
            targetType: input.targetType,
            targetId: input.targetId,
          },
        }),
        input.actorUserId
          ? this.prisma.reaction.findUnique({
              where: {
                userId_targetType_targetId: {
                  userId: input.actorUserId,
                  targetType: input.targetType,
                  targetId: input.targetId,
                },
              },
              select: {
                reactionType: true,
              },
            })
          : Promise.resolve(null),
        input.actorUserId
          ? this.prisma.save.findUnique({
              where: {
                userId_targetType_targetId: {
                  userId: input.actorUserId,
                  targetType: input.targetType,
                  targetId: input.targetId,
                },
              },
              select: {
                id: true,
              },
            })
          : Promise.resolve(null),
      ]);

    const reactionsByType: Partial<Record<ReactionType, number>> = {};

    for (const item of groupedReactions) {
      reactionsByType[item.reactionType as ReactionType] = item._count._all;
    }

    return {
      targetType: input.targetType,
      targetId: input.targetId,
      totalReactions,
      savesCount,
      reactionsByType,
      viewerReactionType: (viewerReaction?.reactionType as ReactionType | undefined) ?? null,
      viewerHasSaved: Boolean(viewerSave),
    };
  }

  public async listMySavedItems(input: ListMySavedItemsQuery): Promise<SaveView[]> {
    const records = await this.prisma.save.findMany({
      where: {
        userId: input.actorUserId,
        ...(input.targetType !== undefined ? { targetType: input.targetType } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return records.map((record) => ({
      id: record.id,
      userId: record.userId,
      targetType: record.targetType,
      targetId: record.targetId,
      createdAt: record.createdAt.toISOString(),
    }));
  }
}
