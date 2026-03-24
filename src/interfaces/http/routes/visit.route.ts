import { Router, type RequestHandler } from "express";
import { buildVisitModule } from "../../../application/visit/visit.module.js";
import type { VisitPrismaClient } from "../../../infrastructure/persistence/prisma/visit-prisma.types.js";
import { VisitController } from "../controllers/visit.controller.js";
import { placeIdParamSchema, visitIdParamSchema } from "./visit.schemas.js";

export interface CreateVisitRouteDeps {
  prisma: VisitPrismaClient;
  attachAuthContext: RequestHandler;
  requireAuth: RequestHandler;
  resolveCurrentUser: RequestHandler;
}

export function createVisitRoute(deps: CreateVisitRouteDeps): Router {
  const router = Router();
  const handlers = buildVisitModule(deps.prisma);
  const controller = new VisitController();

  router.get("/places/:placeId/visit-summary", async (req, res) => {
    try {
      const params = placeIdParamSchema.parse(req.params);
      const result = await handlers.getPlaceVisitSummary.execute(params.placeId);
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get(
    "/me/visits/active",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const result = await handlers.getMyActiveVisit.execute(controller.requireActor(req));
        res.json({ item: result });
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/places/:placeId/visits/start",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = placeIdParamSchema.parse(req.params);
        const result = await handlers.startVisit.execute({
          actor: controller.requireActor(req),
          placeId: params.placeId,
          sourceType: "MANUAL_CHECK_IN",
        });
        res.status(201).json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/visits/:visitId/end",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = visitIdParamSchema.parse(req.params);
        const result = await handlers.endVisit.execute({
          actor: controller.requireActor(req),
          visitId: params.visitId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  return router;
}
