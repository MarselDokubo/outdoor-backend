import { Router, type RequestHandler } from "express";
import { buildPostModule } from "../../../application/post/post.module.js";
import type { PostPrismaClient } from "../../../infrastructure/persistence/prisma/post-prisma.types.js";
import { PostController } from "../controllers/post.controller.js";
import {
  createPostBodySchema,
  listMyPostsQuerySchema,
  listPlacePostsQuerySchema,
  placeIdParamSchema,
  postIdParamSchema,
  updatePostBodySchema,
} from "./post.schemas.js";

export interface CreatePostRouteDeps {
  prisma: PostPrismaClient;
  attachAuthContext: RequestHandler;
  requireAuth: RequestHandler;
  resolveCurrentUser: RequestHandler;
  optionalAuth?: RequestHandler;
}

export function createPostRoute(deps: CreatePostRouteDeps): Router {
  const router = Router();
  const handlers = buildPostModule(deps.prisma);
  const controller = new PostController();
  const optionalAuth = deps.optionalAuth ?? ((_req, _res, next) => next());

  router.get("/places/:placeId/posts", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const params = placeIdParamSchema.parse(req.params);
      const query = listPlacePostsQuerySchema.parse(req.query);
      const result = await handlers.listPlacePosts.execute({
        placeId: params.placeId,
        ...(query.limit !== undefined ? { limit: query.limit } : {}),
        ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
      });
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get("/posts/:postId", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const params = postIdParamSchema.parse(req.params);
      const actorUserId = controller.getActorUserId(res);
      const result = await handlers.getPostDetails.execute({
        postId: params.postId,
        ...(actorUserId !== undefined ? { actorUserId } : {}),
      });
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get(
    "/me/posts",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const query = listMyPostsQuerySchema.parse(req.query);
        const result = await handlers.listMyPosts.execute({
          actorUserId: controller.requireActorUserId(res),
          ...(query.limit !== undefined ? { limit: query.limit } : {}),
          ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/posts",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = createPostBodySchema.parse(req.body);
        const result = await handlers.createPost.execute({
          actorUserId: controller.requireActorUserId(res),
          placeId: body.placeId,
          body: body.body,
          visibility: body.visibility,
        });
        res.status(201).json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.patch(
    "/posts/:postId",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = postIdParamSchema.parse(req.params);
        const body = updatePostBodySchema.parse(req.body);
        const result = await handlers.updatePost.execute({
          actorUserId: controller.requireActorUserId(res),
          postId: params.postId,
          body: body.body,
          visibility: body.visibility,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/posts/:postId/publish",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = postIdParamSchema.parse(req.params);
        const result = await handlers.publishPost.execute({
          actorUserId: controller.requireActorUserId(res),
          postId: params.postId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/posts/:postId/archive",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = postIdParamSchema.parse(req.params);
        const result = await handlers.archivePost.execute({
          actorUserId: controller.requireActorUserId(res),
          postId: params.postId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  return router;
}
