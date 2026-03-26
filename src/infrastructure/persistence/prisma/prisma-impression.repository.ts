import type { ImpressionRepository } from "../../../domain/engagement/repositories/impression.repository.js";
import type { Impression } from "../../../domain/engagement/impression.js";
import { toImpressionEntity, toImpressionPersistence } from "./impression-mappers.js";
import type {
  ImpressionPrismaClient,
  ImpressionPrismaTransactionClient,
} from "./impression-prisma.types.js";

type PrismaDb = ImpressionPrismaClient | ImpressionPrismaTransactionClient;

export class PrismaImpressionRepository implements ImpressionRepository {
  constructor(private readonly db: PrismaDb) {}

  public async save(impression: Impression): Promise<void> {
    const data = toImpressionPersistence(impression);

    await this.db.impression.create({
      data,
    });
  }

  public async findRecentByViewer(input: {
    targetType: "PLACE" | "POST" | "EVENT";
    targetId: string;
    viewerUserId: string;
    since: Date;
  }): Promise<Impression | null> {
    const record = await this.db.impression.findFirst({
      where: {
        targetType: input.targetType,
        targetId: input.targetId,
        viewerUserId: input.viewerUserId,
        createdAt: { gte: input.since },
      },
      orderBy: { createdAt: "desc" },
    });

    return record ? toImpressionEntity(record) : null;
  }

  public async findRecentBySession(input: {
    targetType: "PLACE" | "POST" | "EVENT";
    targetId: string;
    sessionKey: string;
    since: Date;
  }): Promise<Impression | null> {
    const record = await this.db.impression.findFirst({
      where: {
        targetType: input.targetType,
        targetId: input.targetId,
        sessionKey: input.sessionKey,
        createdAt: { gte: input.since },
      },
      orderBy: { createdAt: "desc" },
    });

    return record ? toImpressionEntity(record) : null;
  }
}
