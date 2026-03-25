import { Router, type RequestHandler } from "express";
import { buildCommentModule } from "../../../application/engagement/comment.module.js";
import type { EngagementPrismaClient } from "../../../infrastructure/persistence/prisma/engagement-prisma.types.js";
import { CommentController } from "../controllers/comment.controller.js";
import {
  commentIdParamSchema,
  createCommentBodySchema,
  eventIdParamSchema,
  placeIdParamSchema,
  postIdParamSchema,
  updateCommentBodySchema,
} from "./comment.schemas.js";

export interface CreateCommentRouteDeps {
  prisma: EngagementPrismaClient;
  attachAuthContext: RequestHandler;
  requireAuth: RequestHandler;
  resolveCurrentUser: RequestHandler;
  optionalAuth?: RequestHandler;
}

export function createCommentRoute(deps: CreateCommentRouteDeps): Router {
  const router = Router();
  const handlers = buildCommentModule(deps.prisma);
  const controller = new CommentController(handlers);
  const optionalAuth = deps.optionalAuth ?? ((_req, _res, next) => next());

  router.get("/comments/:commentId", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const params = commentIdParamSchema.parse(req.params);
      const result = await handlers.getCommentDetails.execute({
        actorUserId: controller.getActor(req),
        commentId: params.commentId,
      });
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get(
    "/places/:placeId/comments",
    deps.attachAuthContext,
    optionalAuth,
    async (req, res) => {
      try {
        const params = placeIdParamSchema.parse(req.params);
        const result = await handlers.listTargetComments.execute({
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

  router.get("/posts/:postId/comments", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const params = postIdParamSchema.parse(req.params);
      const result = await handlers.listTargetComments.execute({
        actorUserId: controller.getActor(req),
        targetType: "POST",
        targetId: params.postId,
      });
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get(
    "/events/:eventId/comments",
    deps.attachAuthContext,
    optionalAuth,
    async (req, res) => {
      try {
        const params = eventIdParamSchema.parse(req.params);
        const result = await handlers.listTargetComments.execute({
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
    "/me/comments",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const result = await handlers.listMyComments.execute({
          actorUserId: controller.requireActor(req),
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/comments",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = createCommentBodySchema.parse(req.body);
        const result = await handlers.createComment.execute({
          actorUserId: controller.requireActor(req),
          targetType: body.targetType,
          targetId: body.targetId,
          body: body.body,
        });
        res.status(201).json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.patch(
    "/comments/:commentId",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = commentIdParamSchema.parse(req.params);
        const body = updateCommentBodySchema.parse(req.body);
        const result = await handlers.updateComment.execute({
          actorUserId: controller.requireActor(req),
          commentId: params.commentId,
          body: body.body,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.delete(
    "/comments/:commentId",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = commentIdParamSchema.parse(req.params);
        const result = await handlers.deleteComment.execute({
          actorUserId: controller.requireActor(req),
          commentId: params.commentId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  return router;
}
