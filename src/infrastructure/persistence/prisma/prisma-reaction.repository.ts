import type { ReactionRepository } from "../../../domain/engagement/repositories/index.js";
import type { EngagementTargetType } from "../../../domain/engagement/engagement.enums.js";
import type { Reaction } from "../../../domain/engagement/reaction.js";
import type {
  EngagementPrismaClient,
  EngagementPrismaTransactionClient,
} from "./engagement-prisma.types.js";
import { toReactionEntity, toReactionPersistence } from "./engagement-mappers.js";

type PrismaDb = EngagementPrismaClient | EngagementPrismaTransactionClient;

export class PrismaReactionRepository implements ReactionRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findByUserAndTarget(
    userId: string,
    targetType: EngagementTargetType,
    targetId: string,
  ): Promise<Reaction | null> {
    const record = await this.db.reaction.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType,
          targetId,
        },
      },
    });

    return record ? toReactionEntity(record) : null;
  }

  public async save(reaction: Reaction): Promise<void> {
    const data = toReactionPersistence(reaction);

    await this.db.reaction.upsert({
      where: {
        userId_targetType_targetId: {
          userId: data.userId,
          targetType: data.targetType,
          targetId: data.targetId,
        },
      },
      update: {
        reactionType: data.reactionType,
        updatedAt: data.updatedAt,
      },
      create: data,
    });
  }

  public async deleteByUserAndTarget(
    userId: string,
    targetType: EngagementTargetType,
    targetId: string,
  ): Promise<void> {
    await this.db.reaction.deleteMany({
      where: {
        userId,
        targetType,
        targetId,
      },
    });
  }
}
