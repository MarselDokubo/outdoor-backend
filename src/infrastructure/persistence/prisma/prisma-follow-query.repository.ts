import type { Follow as PrismaFollow } from "../../../generated/prisma/client.js";
import type { FollowQueryService } from "../../../application/engagement/use-cases/follow-query-services.js";
import type {
  FollowSummaryView,
  FollowView,
  ListMyFollowsResult,
} from "../../../application/engagement/follow.contracts.js";
import type { FollowTargetType } from "../../../domain/engagement/follow.enums.js";
import type { FollowPrismaClient } from "./follow-prisma.types.js";

export class PrismaFollowQueryService implements FollowQueryService {
  constructor(private readonly prisma: FollowPrismaClient) {}

  public async getUserSummary(input: {
    actorUserId?: string | null;
    userId: string;
  }): Promise<FollowSummaryView> {
    const [followersCount, followingCount, actorFollow] = await Promise.all([
      this.prisma.follow.count({
        where: {
          targetType: "USER",
          targetId: input.userId,
        },
      }),
      this.prisma.follow.count({
        where: {
          followerUserId: input.userId,
          targetType: "USER",
        },
      }),
      input.actorUserId
        ? this.prisma.follow.findUnique({
            where: {
              followerUserId_targetType_targetId: {
                followerUserId: input.actorUserId,
                targetType: "USER",
                targetId: input.userId,
              },
            },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);

    return {
      targetType: "USER",
      targetId: input.userId,
      followersCount,
      isFollowing: Boolean(actorFollow),
      followingCount,
    };
  }

  public async getPlaceSummary(input: {
    actorUserId?: string | null;
    placeId: string;
  }): Promise<FollowSummaryView> {
    const [followersCount, actorFollow] = await Promise.all([
      this.prisma.follow.count({
        where: {
          targetType: "PLACE",
          targetId: input.placeId,
        },
      }),
      input.actorUserId
        ? this.prisma.follow.findUnique({
            where: {
              followerUserId_targetType_targetId: {
                followerUserId: input.actorUserId,
                targetType: "PLACE",
                targetId: input.placeId,
              },
            },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);

    return {
      targetType: "PLACE",
      targetId: input.placeId,
      followersCount,
      isFollowing: Boolean(actorFollow),
      followingCount: null,
    };
  }

  public async listByFollowerUserId(input: {
    followerUserId: string;
    targetType?: FollowTargetType;
    limit: number;
    cursor?: string | null;
  }): Promise<ListMyFollowsResult> {
    const take = Math.min(Math.max(input.limit, 1), 50);

    let cursorRecord: Pick<PrismaFollow, "id" | "createdAt"> | null = null;
    if (input.cursor) {
      cursorRecord = await this.prisma.follow.findUnique({
        where: { id: input.cursor },
        select: { id: true, createdAt: true },
      });
    }

    const records = await this.prisma.follow.findMany({
      where: {
        followerUserId: input.followerUserId,
        ...(input.targetType !== undefined ? { targetType: input.targetType } : {}),
        ...(cursorRecord
          ? {
              OR: [
                { createdAt: { lt: cursorRecord.createdAt } },
                {
                  AND: [{ createdAt: cursorRecord.createdAt }, { id: { lt: cursorRecord.id } }],
                },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: take + 1,
      select: {
        id: true,
        followerUserId: true,
        targetType: true,
        targetId: true,
        createdAt: true,
      },
    });

    const hasMore = records.length > take;
    const items = records.slice(0, take).map(toFollowView);

    return {
      items,
      nextCursor: hasMore ? (items[items.length - 1]?.id ?? null) : null,
    };
  }
}

function toFollowView(
  record: Pick<PrismaFollow, "id" | "followerUserId" | "targetType" | "targetId" | "createdAt">,
): FollowView {
  return {
    id: record.id,
    followerUserId: record.followerUserId,
    targetType: record.targetType,
    targetId: record.targetId,
    createdAt: record.createdAt.toISOString(),
  };
}
