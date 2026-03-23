import { Router, type RequestHandler } from "express";
import { buildPlaceModule } from "../../../application/place/place.module.js";
import type { PlacesPrismaClient } from "../../../infrastructure/persistence/prisma/place-prisma.types.js";
import { PLACE_CATEGORY_CATALOG } from "../../../infrastructure/place/place-category-catalog.js";
import { PlaceController } from "../controllers/place.controller.js";
import {
  claimIdParamSchema,
  createPlaceBodySchema,
  nearbyPlacesQuerySchema,
  placeIdParamSchema,
  reviewClaimBodySchema,
  searchPlacesQuerySchema,
  slugParamSchema,
  submitClaimBodySchema,
  taggingPlacesQuerySchema,
  updateOfficialProfileBodySchema,
  updatePlaceBodySchema,
} from "./place.schemas.js";

export interface CreatePlaceRouteDeps {
  prisma: PlacesPrismaClient;
  attachAuthContext: RequestHandler;
  requireAuth: RequestHandler;
  resolveCurrentUser: RequestHandler;
  optionalAuth?: RequestHandler;
}

export function createPlaceRoute(deps: CreatePlaceRouteDeps): Router {
  const router = Router();
  const handlers = buildPlaceModule(deps.prisma);
  const controller = new PlaceController(handlers);
  const optionalAuth = deps.optionalAuth ?? ((_req, _res, next) => next());

  router.get("/place-categories", (_req, res) => {
    res.json({ items: PLACE_CATEGORY_CATALOG });
  });

  router.get("/places/search", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const query = searchPlacesQuerySchema.parse(req.query);
      const result = await handlers.searchPlaces.execute({
        actor: controller.getActor(req),
        q: query.q,
        category: query.category,
        limit: query.limit,
        cursor: query.cursor,
      });
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get("/places/nearby", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const query = nearbyPlacesQuerySchema.parse(req.query);
      const result = await handlers.findNearbyPlaces.execute({
        actor: controller.getActor(req),
        latitude: query.latitude,
        longitude: query.longitude,
        radiusMeters: query.radiusMeters,
        category: query.category,
        limit: query.limit,
      });
      res.json({ items: result });
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get("/places/tagging", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const query = taggingPlacesQuerySchema.parse(req.query);
      const result = await handlers.searchPlacesForTagging.execute({
        actor: controller.getActor(req),
        q: query.q,
        limit: query.limit,
      });
      res.json({ items: result });
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get("/places/slug/:slug", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const params = slugParamSchema.parse(req.params);
      const result = await handlers.getPlaceDetails.execute({
        actor: controller.getActor(req),
        slug: params.slug,
      });
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.get("/places/:placeId", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const params = placeIdParamSchema.parse(req.params);
      const result = await handlers.getPlaceDetails.execute({
        actor: controller.getActor(req),
        placeId: params.placeId,
      });
      res.json(result);
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.post(
    "/places",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const body = createPlaceBodySchema.parse(req.body);
        const result = await handlers.createPlace.execute({
          actor: controller.requireActor(req),
          ...body,
        });
        res.status(201).json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.patch(
    "/places/:placeId",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = placeIdParamSchema.parse(req.params);
        const body = updatePlaceBodySchema.parse(req.body);
        const result = await handlers.updatePlace.execute({
          actor: controller.requireActor(req),
          placeId: params.placeId,
          ...body,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/places/:placeId/publish",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = placeIdParamSchema.parse(req.params);
        const result = await handlers.publishPlace.execute({
          actor: controller.requireActor(req),
          placeId: params.placeId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/places/:placeId/archive",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = placeIdParamSchema.parse(req.params);
        const result = await handlers.archivePlace.execute({
          actor: controller.requireActor(req),
          placeId: params.placeId,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.patch(
    "/places/:placeId/official-profile",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = placeIdParamSchema.parse(req.params);
        const body = updateOfficialProfileBodySchema.parse(req.body);
        const result = await handlers.updateOfficialProfile.execute({
          actor: controller.requireActor(req),
          placeId: params.placeId,
          ...body,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/places/:placeId/claims",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = placeIdParamSchema.parse(req.params);
        const body = submitClaimBodySchema.parse(req.body);
        const result = await handlers.submitClaim.execute({
          actor: controller.requireActor(req),
          placeId: params.placeId,
          proofReferences: body.proofReferences,
        });
        res.status(201).json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.post(
    "/place-claims/:claimId/review",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = claimIdParamSchema.parse(req.params);
        const body = reviewClaimBodySchema.parse(req.body);
        const result = await handlers.reviewClaim.execute({
          actor: controller.requireActor(req),
          claimId: params.claimId,
          decision: body.decision,
          reviewNotes: body.reviewNotes,
          roleOnApproval: body.roleOnApproval,
        });
        res.json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.get(
    "/place-claims/pending",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const result = await handlers.listPendingPlaceClaims.execute({
          actor: controller.requireActor(req),
        });
        res.json({ items: result });
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.get(
    "/me/places",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const result = await handlers.listMyOwnedPlaces.execute({
          actor: controller.requireActor(req),
        });
        res.json({ items: result });
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  return router;
}
