import { FollowTargetUseCase } from "./use-cases/follow-target.use-case.js";
import { UnfollowTargetUseCase } from "./use-cases/unfollow-target.use-case.js";
import { ListMyFollowsUseCase } from "./use-cases/list-my-follows.use-case.js";
import { GetUserFollowSummaryUseCase } from "./use-cases/get-user-follow-summary.use-case.js";
import { GetPlaceFollowSummaryUseCase } from "./use-cases/get-place-follow-summary.use-case.js";
import { PrismaFollowRepository } from "../../infrastructure/persistence/prisma/prisma-follow.repository.js";
import { PrismaFollowQueryService } from "../../infrastructure/persistence/prisma/prisma-follow-query.repository.js";
import { PrismaFollowTargetAccessService } from "../../infrastructure/persistence/prisma/prisma-follow-target-access.service.js";
import type { FollowPrismaClient } from "../../infrastructure/persistence/prisma/follow-prisma.types.js";

export function buildFollowModule(prisma: FollowPrismaClient) {
  const followRepository = new PrismaFollowRepository(prisma);
  const queryService = new PrismaFollowQueryService(prisma);
  const targetAccessService = new PrismaFollowTargetAccessService(prisma);

  return {
    followTarget: new FollowTargetUseCase(followRepository, targetAccessService),
    unfollowTarget: new UnfollowTargetUseCase(followRepository),
    listMyFollows: new ListMyFollowsUseCase(queryService),
    getUserFollowSummary: new GetUserFollowSummaryUseCase(queryService, targetAccessService),
    getPlaceFollowSummary: new GetPlaceFollowSummaryUseCase(queryService, targetAccessService),
  };
}
