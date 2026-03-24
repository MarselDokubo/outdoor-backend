import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error.js";
import { canViewPlaceDetail } from "../../../domain/place/place-access.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";
import type { MediaAttachmentRepository } from "../../../domain/media/repositories/index.js";
import type { ListPlaceMediaQuery, PlaceMediaView } from "../contracts.js";

export class ListPlaceMediaHandler {
  constructor(
    private readonly places: PlaceRepository,
    private readonly mediaAttachments: MediaAttachmentRepository,
  ) {}

  public async execute(query: ListPlaceMediaQuery): Promise<PlaceMediaView[]> {
    const place = await this.places.findById(query.placeId);

    if (!place) {
      throw new NotFoundError("Place not found.");
    }

    const membership = query.actor?.userId
      ? await this.places.getActiveMembership(query.placeId, query.actor.userId)
      : null;

    const canView = canViewPlaceDetail({
      actor: query.actor ?? null,
      publicationStatus: place.getPublicationStatus(),
      visibility: place.getVisibility(),
      membership,
    });

    if (!canView) {
      throw new ForbiddenError("You do not have access to this place.");
    }

    const attached = await this.mediaAttachments.findActiveForOwner("PLACE", query.placeId);

    return attached
      .filter((item) => item.asset.isReady())
      .sort((a, b) => a.attachment.getSortOrder() - b.attachment.getSortOrder())
      .map((item) => ({
        mediaAssetId: item.asset.id,
        attachmentId: item.attachment.id,
        role: item.attachment.getRole(),
        sortOrder: item.attachment.getSortOrder(),
        kind: item.asset.getKind(),
        mimeType: item.asset.getMimeType(),
        originalFilename: item.asset.getOriginalFilename(),
        sizeBytes: item.asset.getSizeBytes(),
        width: item.asset.getWidth(),
        height: item.asset.getHeight(),
        durationSeconds: item.asset.getDurationSeconds(),
        processingStatus: item.asset.getProcessingStatus(),
        url: `/media/assets/${item.asset.id}/file`,
        createdAt: item.attachment.createdAt.toISOString(),
      }));
  }
}
