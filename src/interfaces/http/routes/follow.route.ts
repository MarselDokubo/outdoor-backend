import { Router, type RequestHandler } from "express";
import { buildFollowModule } from "../../../application/engagement/follow.module.js";
import type { FollowPrismaClient } from "../../../infrastructure/persistence/prisma/follow-prisma.types.js";
import { FollowController } from "../controllers/follow.controller.js";
import {
  followBodySchema,
  listMyFollowsQuerySchema,
  placeIdParamSchema,
  userIdParamSchema,
} from "./follow.schemas.js";

export interface CreateFollowRouteDeps {
  prisma: FollowPrismaClient;
  attachAuthContext: RequestHandler;
  requireAuth: RequestHandler;
  resolveCurrentUser: RequestHandler;
  optionalAuth?: RequestHandler;
}

export function createFollowRoute(deps: CreateFollowRouteDeps): Router {
  const router = Router();
  const handlers = buildFollowModule(deps.prisma);
  const controller = new FollowController(handlers);
  const optionalAuth = deps.optionalAuth ?? ((_req, _res, next) => next());

  router.post(
    "/follows",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = followBodySchema.parse(req.body);
        const result = await handlers.followTarget.execute({
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
    "/follows",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = followBodySchema.parse(req.body);
        const result = await handlers.unfollowTarget.execute({
          actorUserId: controller.requireActor(req),
          targetType: body.targetType,
          targetId: body.targetId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.get(
    "/me/follows",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const query = listMyFollowsQuerySchema.parse(req.query);
        const result = await handlers.listMyFollows.execute({
          actorUserId: controller.requireActor(req),
          ...(query.targetType !== undefined ? { targetType: query.targetType } : {}),
          ...(query.limit !== undefined ? { limit: query.limit } : {}),
          ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.get(
    "/users/:userId/follow-summary",
    deps.attachAuthContext,
    optionalAuth,
    async (req, res) => {
      try {
        const params = userIdParamSchema.parse(req.params);
        const result = await handlers.getUserFollowSummary.execute({
          userId: params.userId,
          ...(controller.getActor(req) !== null ? { actorUserId: controller.getActor(req) } : {}),
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.get(
    "/places/:placeId/follow-summary",
    deps.attachAuthContext,
    optionalAuth,
    async (req, res) => {
      try {
        const params = placeIdParamSchema.parse(req.params);
        const actorUserId = controller.getActor(req);
        const result = await handlers.getPlaceFollowSummary.execute({
          placeId: params.placeId,
          ...(actorUserId !== null ? { actorUserId } : {}),
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  return router;
}
