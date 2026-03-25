import { PrismaEngagementQueryService } from "../../infrastructure/persistence/prisma/prisma-engagement-query.repository.js";
import { PrismaReactionRepository } from "../../infrastructure/persistence/prisma/prisma-reaction.repository.js";
import { PrismaSaveRepository } from "../../infrastructure/persistence/prisma/prisma-save.repository.js";
import { PrismaEngagementTargetAccessService } from "../../infrastructure/persistence/prisma/prisma-engagement-target-access.service.js";
import type { EngagementPrismaClient } from "../../infrastructure/persistence/prisma/engagement-prisma.types.js";
import { GetEngagementSummaryUseCase } from "./use-cases/get-engagement-summary.use-case.js";
import { ListMySavedItemsUseCase } from "./use-cases/list-my-saved-items.use-case.js";
import { ReactToTargetUseCase } from "./use-cases/react-to-target.use-case.js";
import { RemoveReactionUseCase } from "./use-cases/remove-reaction.use-case.js";
import { RemoveSaveUseCase } from "./use-cases/remove-save.use-case.js";
import { SaveTargetUseCase } from "./use-cases/save-target.use-case.js";

export function buildEngagementModule(prisma: EngagementPrismaClient) {
  const reactionRepository = new PrismaReactionRepository(prisma);
  const saveRepository = new PrismaSaveRepository(prisma);
  const queryService = new PrismaEngagementQueryService(prisma);
  const targetAccessService = new PrismaEngagementTargetAccessService(prisma);

  return {
    reactToTarget: new ReactToTargetUseCase(reactionRepository, targetAccessService),
    removeReaction: new RemoveReactionUseCase(reactionRepository),
    saveTarget: new SaveTargetUseCase(saveRepository, targetAccessService),
    removeSave: new RemoveSaveUseCase(saveRepository),
    getEngagementSummary: new GetEngagementSummaryUseCase(queryService, targetAccessService),
    listMySavedItems: new ListMySavedItemsUseCase(queryService),
  };
}
