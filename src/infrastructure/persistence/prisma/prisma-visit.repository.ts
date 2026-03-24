import type { VisitRepository } from "../../../domain/visit/repositories/index.js";
import type { Visit } from "../../../domain/visit/visit.js";
import type { VisitPrismaClient, VisitPrismaTransactionClient } from "./visit-prisma.types.js";
import { toVisitEntity, toVisitPersistence } from "./visit-mappers.js";

type PrismaDb = VisitPrismaClient | VisitPrismaTransactionClient;

export class PrismaVisitRepository implements VisitRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findById(visitId: string): Promise<Visit | null> {
    const record = await this.db.visit.findUnique({
      where: { id: visitId },
    });

    return record ? toVisitEntity(record) : null;
  }

  public async findActiveByUserId(userId: string): Promise<Visit | null> {
    const record = await this.db.visit.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        endedAt: null,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    return record ? toVisitEntity(record) : null;
  }

  public async save(visit: Visit): Promise<void> {
    const data = toVisitPersistence(visit);

    await this.db.visit.upsert({
      where: { id: data.id },
      update: {
        status: data.status,
        sourceType: data.sourceType,
        startedAt: data.startedAt,
        endedAt: data.endedAt,
        confidenceScore: data.confidenceScore,
        updatedAt: data.updatedAt,
      },
      create: data,
    });
  }
}
