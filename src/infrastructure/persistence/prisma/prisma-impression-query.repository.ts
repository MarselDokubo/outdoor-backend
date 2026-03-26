import type { ImpressionQueryService } from "../../../application/engagement/use-cases/impression-query-services.js";
import type { ImpressionSummaryView } from "../../../application/engagement/impression.contracts.js";
import type { ImpressionPrismaClient } from "./impression-prisma.types.js";

export class PrismaImpressionQueryService implements ImpressionQueryService {
  constructor(private readonly prisma: ImpressionPrismaClient) {}

  public async getSummary(input: {
    targetType: "PLACE" | "POST" | "EVENT";
    targetId: string;
    actorUserId: string | null;
    sessionKey: string | null;
  }): Promise<ImpressionSummaryView> {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalImpressions, impressionsLast24Hours, viewerRecord] = await Promise.all([
      this.prisma.impression.count({
        where: {
          targetType: input.targetType,
          targetId: input.targetId,
        },
      }),
      this.prisma.impression.count({
        where: {
          targetType: input.targetType,
          targetId: input.targetId,
          createdAt: { gte: last24Hours },
        },
      }),
      this.findViewerRecord(input),
    ]);

    return {
      targetType: input.targetType,
      targetId: input.targetId,
      totalImpressions,
      impressionsLast24Hours,
      viewerHasViewed: Boolean(viewerRecord),
    };
  }

  private async findViewerRecord(input: {
    targetType: "PLACE" | "POST" | "EVENT";
    targetId: string;
    actorUserId: string | null;
    sessionKey: string | null;
  }) {
    if (input.actorUserId) {
      return this.prisma.impression.findFirst({
        where: {
          targetType: input.targetType,
          targetId: input.targetId,
          viewerUserId: input.actorUserId,
        },
        select: { id: true },
      });
    }

    if (input.sessionKey) {
      return this.prisma.impression.findFirst({
        where: {
          targetType: input.targetType,
          targetId: input.targetId,
          sessionKey: input.sessionKey,
        },
        select: { id: true },
      });
    }

    return null;
  }
}
