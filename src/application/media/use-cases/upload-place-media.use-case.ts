import { randomUUID } from "node:crypto";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/errors/app-error.js";
import { MediaAsset } from "../../../domain/media/media-asset.js";
import { MediaAttachment } from "../../../domain/media/media-attachment.js";
import { inferMediaKindFromMimeType } from "../../../domain/media/media.enums.js";
import type { MediaTransactionManager } from "../../../domain/media/repositories/index.js";
import { isStaffActor } from "../../../domain/place/place-actor.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";
import type { UploadPlaceMediaCommand, UploadPlaceMediaResult } from "../contracts.js";
import type { ObjectStorageService } from "./object-storage.js";

export class UploadPlaceMediaHandler {
  constructor(
    private readonly places: PlaceRepository,
    private readonly transactions: MediaTransactionManager,
    private readonly storage: ObjectStorageService,
  ) {}

  public async execute(command: UploadPlaceMediaCommand): Promise<UploadPlaceMediaResult> {
    const place = await this.places.findById(command.placeId);

    if (!place) {
      throw new NotFoundError("Place not found.");
    }

    const membership = await this.places.getActiveMembership(command.placeId, command.actor.userId);
    const canManage =
      isStaffActor(command.actor) ||
      place.createdByUserId === command.actor.userId ||
      Boolean(membership);

    if (!canManage) {
      throw new ForbiddenError("You are not allowed to manage media for this place.");
    }

    if (command.file.sizeBytes <= 0) {
      throw new BadRequestError("Uploaded media must not be empty.");
    }

    const kind = inferMediaKindFromMimeType(command.file.mimeType);
    const mediaAssetId = `media_${randomUUID()}`;
    const attachmentId = `media_attachment_${randomUUID()}`;
    const storageKey = buildStorageKey(place.id, mediaAssetId, command.file.originalFilename);

    const putResult = await this.storage.putObject({
      key: storageKey,
      body: command.file.buffer,
      contentType: command.file.mimeType,
    });

    const mediaAsset = MediaAsset.create({
      id: mediaAssetId,
      uploaderUserId: command.actor.userId,
      kind,
      mimeType: command.file.mimeType,
      originalFilename: command.file.originalFilename,
      storageKey: putResult.key,
      sizeBytes: command.file.sizeBytes,
      checksumSha256: putResult.checksumSha256,
      processingStatus: "READY",
    });

    const attachment = MediaAttachment.create({
      id: attachmentId,
      mediaAssetId,
      ownerType: "PLACE",
      ownerId: command.placeId,
      role: command.role ?? "GALLERY",
      sortOrder: command.sortOrder ?? 0,
      attachedByUserId: command.actor.userId,
    });

    await this.transactions.withTransaction(async ({ mediaAssets, mediaAttachments }) => {
      await mediaAssets.save(mediaAsset);
      await mediaAttachments.save(attachment);
    });

    return {
      mediaAssetId,
      attachmentId,
      processingStatus: mediaAsset.getProcessingStatus(),
      url: buildMediaAssetUrl(mediaAssetId),
    };
  }
}

function buildStorageKey(placeId: string, mediaAssetId: string, originalFilename: string): string {
  const safeName = originalFilename
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `places/${placeId}/${mediaAssetId}/${safeName || "upload.bin"}`;
}

function buildMediaAssetUrl(mediaAssetId: string): string {
  return `/media/assets/${mediaAssetId}/file`;
}
