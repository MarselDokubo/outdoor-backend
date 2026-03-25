import { Router, type RequestHandler } from "express";
import { buildEngagementModule } from "../../../application/engagement/engagement.module.js";
import type { EngagementPrismaClient } from "../../../infrastructure/persistence/prisma/engagement-prisma.types.js";
import { EngagementController } from "../controllers/engagement.controller.js";
import {
  eventIdParamSchema,
  listMySavedQuerySchema,
  placeIdParamSchema,
  postIdParamSchema,
  reactToTargetBodySchema,
  removeReactionBodySchema,
  removeSaveBodySchema,
  saveTargetBodySchema,
} from "./engagement.schemas.js";

export interface CreateEngagementRouteDeps {
  prisma: EngagementPrismaClient;
  attachAuthContext: RequestHandler;
  requireAuth: RequestHandler;
  resolveCurrentUser: RequestHandler;
  optionalAuth?: RequestHandler;
}

export function createEngagementRoute(deps: CreateEngagementRouteDeps): Router {
  const router = Router();
  const handlers = buildEngagementModule(deps.prisma);
  const controller = new EngagementController(handlers);
  const optionalAuth = deps.optionalAuth ?? ((_req, _res, next) => next());

  router.get(
    "/places/:placeId/engagement",
    deps.attachAuthContext,
    optionalAuth,
    async (req, res) => {
      try {
        const params = placeIdParamSchema.parse(req.params);
        const result = await handlers.getEngagementSummary.execute({
          actorUserId: controller.getActor(req),
          targetType: "PLACE",
          targetId: params.placeId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.get(
    "/posts/:postId/engagement",
    deps.attachAuthContext,
    optionalAuth,
    async (req, res) => {
      try {
        const params = postIdParamSchema.parse(req.params);
        const result = await handlers.getEngagementSummary.execute({
          actorUserId: controller.getActor(req),
          targetType: "POST",
          targetId: params.postId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.get(
    "/events/:eventId/engagement",
    deps.attachAuthContext,
    optionalAuth,
    async (req, res) => {
      try {
        const params = eventIdParamSchema.parse(req.params);
        const result = await handlers.getEngagementSummary.execute({
          actorUserId: controller.getActor(req),
          targetType: "EVENT",
          targetId: params.eventId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.get(
    "/me/saved",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const query = listMySavedQuerySchema.parse(req.query);
        const result = await handlers.listMySavedItems.execute({
          actorUserId: controller.requireActor(req),
          ...(query.targetType !== undefined ? { targetType: query.targetType } : {}),
        });
        res.json({ items: result });
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/engagement/reactions",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = reactToTargetBodySchema.parse(req.body);
        const result = await handlers.reactToTarget.execute({
          actorUserId: controller.requireActor(req),
          targetType: body.targetType,
          targetId: body.targetId,
          reactionType: body.reactionType,
        });
        res.status(201).json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.delete(
    "/engagement/reactions",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = removeReactionBodySchema.parse(req.body);
        await handlers.removeReaction.execute({
          actorUserId: controller.requireActor(req),
          targetType: body.targetType,
          targetId: body.targetId,
        });
        res.status(204).send();
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/engagement/saves",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = saveTargetBodySchema.parse(req.body);
        const result = await handlers.saveTarget.execute({
          actorUserId: controller.requireActor(req),
          targetType: body.targetType,
          targetId: body.targetId,
        });
        res.status(201).json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.delete(
    "/engagement/saves",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = removeSaveBodySchema.parse(req.body);
        await handlers.removeSave.execute({
          actorUserId: controller.requireActor(req),
          targetType: body.targetType,
          targetId: body.targetId,
        });
        res.status(204).send();
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  return router;
}
