import type { VisitPrismaClient } from "./visit-prisma.types.js";
import type { VisitQueryService } from "../../../application/visit/use-cases/query-services.js";
import type {
  ActiveVisitView,
  PlaceVisitSummaryView,
} from "../../../application/visit/contracts.js";

interface ActiveVisitRecord {
  id: string;
  placeId: string;
  status: string;
  sourceType: string;
  startedAt: Date;
  endedAt: Date | null;
  confidenceScore: number | null;
}

export class PrismaVisitQueryService implements VisitQueryService {
  constructor(private readonly prisma: VisitPrismaClient) {}

  public async getPlaceVisitSummary(placeId: string): Promise<PlaceVisitSummaryView> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [activeVisits, totalVisits, visitsLast24Hours, lastVisit] = await Promise.all([
      this.prisma.visit.count({
        where: {
          placeId,
          status: "ACTIVE",
          endedAt: null,
        },
      }),
      this.prisma.visit.count({
        where: {
          placeId,
          status: {
            in: ["ACTIVE", "COMPLETED"],
          },
        },
      }),
      this.prisma.visit.count({
        where: {
          placeId,
          startedAt: {
            gte: last24Hours,
          },
          status: {
            in: ["ACTIVE", "COMPLETED"],
          },
        },
      }),
      this.prisma.visit.findFirst({
        where: {
          placeId,
          status: {
            in: ["ACTIVE", "COMPLETED"],
          },
        },
        orderBy: {
          startedAt: "desc",
        },
        select: {
          startedAt: true,
        },
      }),
    ]);

    return {
      placeId,
      activeVisits,
      totalVisits,
      visitsLast24Hours,
      lastVisitStartedAt: lastVisit?.startedAt ? lastVisit.startedAt.toISOString() : null,
    };
  }

  public async getActiveVisitForUser(userId: string): Promise<ActiveVisitView | null> {
    const record = (await this.prisma.visit.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        endedAt: null,
      },
      orderBy: {
        startedAt: "desc",
      },
      select: {
        id: true,
        placeId: true,
        status: true,
        sourceType: true,
        startedAt: true,
        endedAt: true,
        confidenceScore: true,
      },
    })) as ActiveVisitRecord | null;

    if (!record) {
      return null;
    }

    return {
      visitId: record.id,
      placeId: record.placeId,
      status: record.status as ActiveVisitView["status"],
      sourceType: record.sourceType as ActiveVisitView["sourceType"],
      startedAt: record.startedAt.toISOString(),
      endedAt: record.endedAt ? record.endedAt.toISOString() : null,
      confidenceScore: record.confidenceScore,
    };
  }
}
