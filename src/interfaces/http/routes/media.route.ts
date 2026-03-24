import { Router, type RequestHandler } from "express";
import multer from "multer";
import { buildMediaModule } from "../../../application/media/media.module.js";
import type { MediaPrismaClient } from "../../../infrastructure/persistence/prisma/media-prisma.types.js";
import type { ObjectStorageService } from "../../../infrastructure/storage/object-storage.service.js";
import { MediaController } from "../controllers/media.controller.js";
import {
  attachPlaceMediaBodySchema,
  mediaAssetParamsSchema,
  placeMediaDeleteParamsSchema,
  placeMediaParamsSchema,
} from "./media.schemas.js";

const MAX_MEDIA_UPLOAD_BYTES = 25 * 1024 * 1024;
const ACCEPTED_MEDIA_PREFIXES = ["image/", "video/"] as const;

function createUploadMiddleware() {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: MAX_MEDIA_UPLOAD_BYTES,
      files: 1,
    },
    fileFilter: (_req, file, callback) => {
      const isAccepted = ACCEPTED_MEDIA_PREFIXES.some((prefix) => file.mimetype.startsWith(prefix));
      if (!isAccepted) {
        callback(new Error("Unsupported media type."));
        return;
      }

      callback(null, true);
    },
  });
}

export interface CreateMediaRouteDeps {
  prisma: MediaPrismaClient;
  storage: ObjectStorageService;
  attachAuthContext: RequestHandler;
  requireAuth: RequestHandler;
  resolveCurrentUser: RequestHandler;
  optionalAuth?: RequestHandler;
}

export function createMediaRoute(deps: CreateMediaRouteDeps): Router {
  const router = Router();
  const upload = createUploadMiddleware();
  const handlers = buildMediaModule(deps.prisma, deps.storage);
  const controller = new MediaController(handlers);
  const optionalAuth = deps.optionalAuth ?? ((_req, _res, next) => next());

  router.get("/places/:placeId/media", deps.attachAuthContext, optionalAuth, async (req, res) => {
    try {
      const params = placeMediaParamsSchema.parse(req.params);
      const result = await handlers.listPlaceMedia.execute({
        actor: controller.getActor(req),
        placeId: params.placeId,
      });

      res.json({ items: result });
    } catch (error) {
      controller.sendError(res, error);
    }
  });

  router.post(
    "/places/:placeId/media",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    upload.single("file"),
    async (req, res) => {
      try {
        const params = placeMediaParamsSchema.parse(req.params);
        const body = attachPlaceMediaBodySchema.parse(req.body);

        if (!req.file) {
          throw new Error("A multipart file field named 'file' is required.");
        }

        const result = await handlers.uploadPlaceMedia.execute({
          actor: controller.requireActor(req),
          placeId: params.placeId,
          role: body.role,
          sortOrder: body.sortOrder,
          file: {
            buffer: req.file.buffer,
            originalFilename: req.file.originalname,
            mimeType: req.file.mimetype,
            sizeBytes: req.file.size,
          },
        });

        res.status(201).json(result);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.delete(
    "/places/:placeId/media/:mediaAssetId",
    deps.attachAuthContext,
    deps.requireAuth,
    deps.resolveCurrentUser,
    async (req, res) => {
      try {
        const params = placeMediaDeleteParamsSchema.parse(req.params);

        await handlers.detachPlaceMedia.execute({
          actor: controller.requireActor(req),
          placeId: params.placeId,
          mediaAssetId: params.mediaAssetId,
        });

        res.status(204).send();
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  router.get(
    "/media/assets/:mediaAssetId/file",
    deps.attachAuthContext,
    optionalAuth,
    async (req, res) => {
      try {
        const params = mediaAssetParamsSchema.parse(req.params);

        const file = await handlers.getMediaFile.execute({
          actor: controller.getActor(req),
          mediaAssetId: params.mediaAssetId,
        });

        const storedObject = await deps.storage.getObject(file.storageKey);

        res.setHeader("Content-Type", file.mimeType);
        res.setHeader("Content-Length", String(storedObject.contentLength));
        res.setHeader("Content-Disposition", `inline; filename="${file.originalFilename}"`);

        storedObject.stream.pipe(res);
      } catch (error) {
        controller.sendError(res, error);
      }
    },
  );

  return router;
}
