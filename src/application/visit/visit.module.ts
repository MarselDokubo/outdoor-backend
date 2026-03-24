import type { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPlaceRepository } from "../../infrastructure/persistence/prisma/prisma-place.repository.js";
import { PrismaVisitQueryService } from "../../infrastructure/persistence/prisma/prisma-visit-query.repository.js";
import { PrismaVisitRepository } from "../../infrastructure/persistence/prisma/prisma-visit.repository.js";
import { EndVisitHandler } from "./use-cases/end-visit.use-case.js";
import { GetMyActiveVisitHandler } from "./use-cases/get-my-active-visit.use-case.js";
import { GetPlaceVisitSummaryHandler } from "./use-cases/get-place-visit-summary.use-case.js";
import { StartVisitHandler } from "./use-cases/start-visit.use-case.js";

export function buildVisitModule(prisma: PrismaClient) {
  const visits = new PrismaVisitRepository(prisma);
  const places = new PrismaPlaceRepository(prisma);
  const queries = new PrismaVisitQueryService(prisma);

  return {
    startVisit: new StartVisitHandler(visits, places),
    endVisit: new EndVisitHandler(visits),
    getPlaceVisitSummary: new GetPlaceVisitSummaryHandler(places, queries),
    getMyActiveVisit: new GetMyActiveVisitHandler(queries),
  };
}
