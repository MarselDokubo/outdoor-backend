import { NotFoundError, ForbiddenError } from "../../../shared/errors/app-error.js";
import { isStaffActor } from "../../../domain/place/place-actor.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";
import type { MediaTransactionManager } from "../../../domain/media/repositories/index.js";
import type { ObjectStorageService } from "./object-storage.js";
import type { DetachPlaceMediaCommand } from "../contracts.js";

export class DetachPlaceMediaHandler {
  constructor(
    private readonly places: PlaceRepository,
    private readonly transactions: MediaTransactionManager,
    private readonly storage: ObjectStorageService,
  ) {}

  public async execute(command: DetachPlaceMediaCommand): Promise<void> {
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

    await this.transactions.withTransaction(async ({ mediaAssets, mediaAttachments }) => {
      const attached = await mediaAttachments.findActiveForOwnerAndMedia(
        "PLACE",
        command.placeId,
        command.mediaAssetId,
      );

      if (!attached) {
        throw new NotFoundError("Place media attachment not found.");
      }

      attached.attachment.detach();
      await mediaAttachments.save(attached.attachment);

      const activeCount = await mediaAttachments.countActiveForMedia(command.mediaAssetId);
      if (activeCount === 0) {
        attached.asset.markDeleted();
        await mediaAssets.save(attached.asset);
        await this.storage.deleteObject(attached.asset.getStorageKey());
      }
    });
  }
}
