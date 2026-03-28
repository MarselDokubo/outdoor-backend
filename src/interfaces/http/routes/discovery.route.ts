import { Router } from "express";
import { buildDiscoveryModule } from "../../../application/discovery/discovery.module.js";
import type { DiscoveryPrismaClient } from "../../../infrastructure/persistence/prisma/discovery-prisma.types.js";
import { DiscoveryController } from "../controllers/discovery.controller.js";
import {
  hotspotNearbyQuerySchema,
  hotspotPlaceParamSchema,
  hotspotPlaceQuerySchema,
} from "./discovery.schemas.js";

export interface CreateDiscoveryRouteDeps {
  prisma: DiscoveryPrismaClient;
}

export function createDiscoveryRoute(deps: CreateDiscoveryRouteDeps): Router {
  const router = Router();
  const handlers = buildDiscoveryModule(deps.prisma);
  const controller = new DiscoveryController();

  router.get("/discovery/hotspots/nearby", async (req, res) => {
    try {
      const query = hotspotNearbyQuerySchema.parse(req.query);

      const command = {
        actorUserId: controller.optionalActor(req),
        latitude: query.latitude,
        longitude: query.longitude,
        radiusMeters: query.radiusMeters,
        ...(query.limit !== undefined ? { limit: query.limit } : {}),
        ...(query.window !== undefined ? { window: query.window } : {}),
      };

      const result = await handlers.listNearbyHotspots.execute(command);
      res.json({ items: result });
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get("/places/:placeId/hotspot", async (req, res) => {
    try {
      const params = hotspotPlaceParamSchema.parse(req.params);
      const query = hotspotPlaceQuerySchema.parse(req.query);

      const command = {
        placeId: params.placeId,
        actorUserId: controller.optionalActor(req),
        ...(query.window !== undefined ? { window: query.window } : {}),
      };

      const result = await handlers.getPlaceHotspot.execute(command);
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  return router;
}
