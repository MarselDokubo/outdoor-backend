import type { DiscoveryPrismaClient } from "../../infrastructure/persistence/prisma/discovery-prisma.types.js";
import { H3GridService } from "../../infrastructure/h3/h3-grid.service.js";
import { PrismaHotspotQueryService } from "../../infrastructure/persistence/prisma/prisma-hotspot-query.repository.js";
import { GetPlaceHotspotUseCase } from "./use-cases/get-place-hotspot.use-case.js";
import { ListNearbyHotspotsUseCase } from "./use-cases/list-nearby-hotspots.use-case.js";

export function buildDiscoveryModule(prisma: DiscoveryPrismaClient) {
  const queryService = new PrismaHotspotQueryService(prisma);
  const h3GridService = new H3GridService();

  return {
    listNearbyHotspots: new ListNearbyHotspotsUseCase(queryService, h3GridService),
    getPlaceHotspot: new GetPlaceHotspotUseCase(queryService, h3GridService),
  };
}
