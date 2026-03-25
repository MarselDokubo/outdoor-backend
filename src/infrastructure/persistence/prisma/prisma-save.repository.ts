import type { SaveRepository } from "../../../domain/engagement/repositories/index.js";
import type { EngagementTargetType } from "../../../domain/engagement/engagement.enums.js";
import type { Save } from "../../../domain/engagement/save.js";
import type {
  EngagementPrismaClient,
  EngagementPrismaTransactionClient,
} from "./engagement-prisma.types.js";
import { toSaveEntity, toSavePersistence } from "./engagement-mappers.js";

type PrismaDb = EngagementPrismaClient | EngagementPrismaTransactionClient;

export class PrismaSaveRepository implements SaveRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findByUserAndTarget(
    userId: string,
    targetType: EngagementTargetType,
    targetId: string,
  ): Promise<Save | null> {
    const record = await this.db.save.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType,
          targetId,
        },
      },
    });

    return record ? toSaveEntity(record) : null;
  }

  public async save(item: Save): Promise<void> {
    const data = toSavePersistence(item);

    await this.db.save.upsert({
      where: {
        userId_targetType_targetId: {
          userId: data.userId,
          targetType: data.targetType,
          targetId: data.targetId,
        },
      },
      update: {},
      create: data,
    });
  }

  public async deleteByUserAndTarget(
    userId: string,
    targetType: EngagementTargetType,
    targetId: string,
  ): Promise<void> {
    await this.db.save.deleteMany({
      where: {
        userId,
        targetType,
        targetId,
      },
    });
  }
}
