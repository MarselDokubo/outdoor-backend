import { Router, type RequestHandler } from "express";
import { buildImpressionModule } from "../../../application/engagement/impression.module.js";
import type { EngagementPrismaClient } from "../../../infrastructure/persistence/prisma/engagement-prisma.types.js";
import { ImpressionController } from "../controllers/impression.controller.js";
import {
  getImpressionSummaryQuerySchema,
  recordImpressionBodySchema,
} from "./impression.schemas.js";

export interface CreateImpressionRouteDeps {
  prisma: EngagementPrismaClient;
  attachAuthContext: RequestHandler;
  optionalAuth?: RequestHandler;
}

export function createImpressionRoute(deps: CreateImpressionRouteDeps): Router {
  const router = Router();
  const handlers = buildImpressionModule(deps.prisma);
  const controller = new ImpressionController(handlers);
  const optionalAuth = deps.optionalAuth ?? ((_req, _res, next) => next());

  router.get(
    "/engagement/impressions/summary",
    deps.attachAuthContext,
    optionalAuth,
    async (req, res) => {
      try {
        const query = getImpressionSummaryQuerySchema.parse(req.query);
        const result = await handlers.getImpressionSummary.execute({
          targetType: query.targetType,
          targetId: query.targetId,
          actorUserId: controller.getActorUserId(req),
          sessionKey: query.sessionKey ?? null,
        });

        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post("/engagement/impressions", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const body = recordImpressionBodySchema.parse(req.body);
      const result = await handlers.recordImpression.execute({
        targetType: body.targetType,
        targetId: body.targetId,
        actorUserId: controller.getActorUserId(req),
        sessionKey: body.sessionKey ?? null,
      });

      res.status(201).json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  return router;
}
