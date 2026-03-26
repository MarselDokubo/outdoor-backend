import { RecordImpressionUseCase } from "./use-cases/record-impression.use-case.js";
import { GetImpressionSummaryUseCase } from "./use-cases/get-impression-summary.use-case.js";
import { PrismaImpressionRepository } from "../../infrastructure/persistence/prisma/prisma-impression.repository.js";
import { PrismaImpressionQueryService } from "../../infrastructure/persistence/prisma/prisma-impression-query.repository.js";
import { PrismaEngagementTargetAccessService } from "../../infrastructure/persistence/prisma/prisma-engagement-target-access.service.js";
import type { EngagementPrismaClient } from "../../infrastructure/persistence/prisma/engagement-prisma.types.js";

export function buildImpressionModule(prisma: EngagementPrismaClient) {
  const impressionRepository = new PrismaImpressionRepository(prisma);
  const impressionQueryService = new PrismaImpressionQueryService(prisma);
  const targetAccessService = new PrismaEngagementTargetAccessService(prisma);

  return {
    recordImpression: new RecordImpressionUseCase(impressionRepository, targetAccessService),
    getImpressionSummary: new GetImpressionSummaryUseCase(
      impressionQueryService,
      targetAccessService,
    ),
  };
}
