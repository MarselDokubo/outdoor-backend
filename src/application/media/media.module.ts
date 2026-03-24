import type { PlacesPrismaClient } from "../../infrastructure/persistence/prisma/place-prisma.types.js";
import { PrismaPlaceRepository } from "../../infrastructure/persistence/prisma/prisma-place.repository.js";
import { PrismaMediaAssetRepository } from "../../infrastructure/persistence/prisma/prisma-media-asset.repository.js";
import { PrismaMediaAttachmentRepository } from "../../infrastructure/persistence/prisma/prisma-media-attachment.repository.js";
import { PrismaMediaTransactionManager } from "../../infrastructure/persistence/prisma/prisma-media-transaction-manager.js";
import type { ObjectStorageService } from "./use-cases/object-storage.js";
import { UploadPlaceMediaHandler } from "./use-cases/upload-place-media.use-case.js";
import { ListPlaceMediaHandler } from "./use-cases/list-place-media.use-case.js";
import { GetMediaFileHandler } from "./use-cases/get-media-file.use-case.js";
import { DetachPlaceMediaHandler } from "./use-cases/detach-place-media.use-case.js";

export function buildMediaModule(prisma: PlacesPrismaClient, storage: ObjectStorageService) {
  const places = new PrismaPlaceRepository(prisma);
  const mediaAssets = new PrismaMediaAssetRepository(prisma);
  const mediaAttachments = new PrismaMediaAttachmentRepository(prisma);
  const transactions = new PrismaMediaTransactionManager(prisma);

  return {
    uploadPlaceMedia: new UploadPlaceMediaHandler(places, transactions, storage),
    listPlaceMedia: new ListPlaceMediaHandler(places, mediaAttachments),
    getMediaFile: new GetMediaFileHandler(places, mediaAssets, mediaAttachments),
    detachPlaceMedia: new DetachPlaceMediaHandler(places, transactions, storage),
  };
}
