import { Router, type RequestHandler } from "express";
import { buildEventModule } from "../../../application/event/event.module.js";
import type { EventPrismaClient } from "../../../infrastructure/persistence/prisma/event-prisma.types.js";
import { EventController } from "../controllers/event.controller.js";
import {
  createEventBodySchema,
  eventIdParamSchema,
  placeIdParamSchema,
  updateEventBodySchema,
} from "./event.schemas.js";

export interface CreateEventRouteDeps {
  prisma: EventPrismaClient;
  attachAuthContext: RequestHandler;
  requireAuth: RequestHandler;
  resolveCurrentUser: RequestHandler;
  optionalAuth?: RequestHandler;
}

export function createEventRoute(deps: CreateEventRouteDeps): Router {
  const router = Router();
  const handlers = buildEventModule(deps.prisma);
  const controller = new EventController(handlers);
  const optionalAuth = deps.optionalAuth ?? ((_req, _res, next) => next());

  router.get("/events/:eventId", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const params = eventIdParamSchema.parse(req.params);
      const result = await handlers.getEventDetails.execute({
        actorUserId: controller.getActor(req),
        eventId: params.eventId,
      });
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get("/places/:placeId/events", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const params = placeIdParamSchema.parse(req.params);
      const result = await handlers.listPlaceEvents.execute({
        actorUserId: controller.getActor(req),
        placeId: params.placeId,
      });
      res.json({ items: result });
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get(
    "/me/events",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const result = await handlers.listMyEvents.execute({
          actorUserId: controller.requireActor(req),
        });
        res.json({ items: result });
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/events",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = createEventBodySchema.parse(req.body);

        const result = await handlers.createEvent.execute({
          actorUserId: controller.requireActor(req),
          title: body.title,
          startsAt: body.startsAt,
          endsAt: body.endsAt,
          ...(body.placeId !== undefined ? { placeId: body.placeId } : {}),
          ...(body.summary !== undefined ? { summary: body.summary } : {}),
          ...(body.description !== undefined ? { description: body.description } : {}),
          ...(body.visibility !== undefined ? { visibility: body.visibility } : {}),
        });

        res.status(201).json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.patch(
    "/events/:eventId",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = eventIdParamSchema.parse(req.params);
        const body = updateEventBodySchema.parse(req.body);

        const result = await handlers.updateEvent.execute({
          actorUserId: controller.requireActor(req),
          eventId: params.eventId,
          ...(body.placeId !== undefined ? { placeId: body.placeId } : {}),
          ...(body.title !== undefined ? { title: body.title } : {}),
          ...(body.summary !== undefined ? { summary: body.summary } : {}),
          ...(body.description !== undefined ? { description: body.description } : {}),
          ...(body.startsAt !== undefined ? { startsAt: body.startsAt } : {}),
          ...(body.endsAt !== undefined ? { endsAt: body.endsAt } : {}),
          ...(body.visibility !== undefined ? { visibility: body.visibility } : {}),
        });

        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/events/:eventId/publish",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = eventIdParamSchema.parse(req.params);
        const result = await handlers.publishEvent.execute({
          actorUserId: controller.requireActor(req),
          eventId: params.eventId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/events/:eventId/cancel",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = eventIdParamSchema.parse(req.params);
        const result = await handlers.cancelEvent.execute({
          actorUserId: controller.requireActor(req),
          eventId: params.eventId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/events/:eventId/archive",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = eventIdParamSchema.parse(req.params);
        const result = await handlers.archiveEvent.execute({
          actorUserId: controller.requireActor(req),
          eventId: params.eventId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  return router;
}
