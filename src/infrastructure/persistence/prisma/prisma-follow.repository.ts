import type { FollowRepository } from "../../../domain/engagement/repositories/follow.repository.js";
import type { Follow } from "../../../domain/engagement/follow.js";
import type { FollowTargetType } from "../../../domain/engagement/follow.enums.js";
import type { FollowPrismaClient, FollowPrismaTransactionClient } from "./follow-prisma.types.js";
import { toFollowEntity, toFollowPersistence } from "./follow-mappers.js";

type PrismaDb = FollowPrismaClient | FollowPrismaTransactionClient;

export class PrismaFollowRepository implements FollowRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findByFollowerAndTarget(
    followerUserId: string,
    targetType: FollowTargetType,
    targetId: string,
  ): Promise<Follow | null> {
    const record = await this.db.follow.findUnique({
      where: {
        followerUserId_targetType_targetId: {
          followerUserId,
          targetType,
          targetId,
        },
      },
    });

    return record ? toFollowEntity(record) : null;
  }

  public async save(follow: Follow): Promise<void> {
    const data = toFollowPersistence(follow);

    await this.db.follow.upsert({
      where: {
        followerUserId_targetType_targetId: {
          followerUserId: data.followerUserId,
          targetType: data.targetType,
          targetId: data.targetId,
        },
      },
      update: {},
      create: data,
    });
  }

  public async deleteByFollowerAndTarget(
    followerUserId: string,
    targetType: FollowTargetType,
    targetId: string,
  ): Promise<void> {
    await this.db.follow.deleteMany({
      where: {
        followerUserId,
        targetType,
        targetId,
      },
    });
  }
}
