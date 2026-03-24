import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error.js";
import { canViewPlaceDetail } from "../../../domain/place/place-access.js";
import type {
  MediaAssetRepository,
  MediaAttachmentRepository,
} from "../../../domain/media/repositories/index.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";
import type { GetMediaFileQuery, GetMediaFileResult } from "../contracts.js";

export class GetMediaFileHandler {
  constructor(
    private readonly places: PlaceRepository,
    private readonly mediaAssets: MediaAssetRepository,
    private readonly mediaAttachments: MediaAttachmentRepository,
  ) {}

  public async execute(query: GetMediaFileQuery): Promise<GetMediaFileResult> {
    const mediaAsset = await this.mediaAssets.findById(query.mediaAssetId);

    if (!mediaAsset || mediaAsset.isDeleted() || !mediaAsset.isReady()) {
      throw new NotFoundError("Media asset not found.");
    }

    const attachments = await this.mediaAttachments.findActiveForMedia(query.mediaAssetId);

    for (const attached of attachments) {
      if (attached.attachment.getOwnerType() !== "PLACE") {
        continue;
      }

      const place = await this.places.findById(attached.attachment.getOwnerId());
      if (!place) {
        continue;
      }

      const membership = query.actor?.userId
        ? await this.places.getActiveMembership(place.id, query.actor.userId)
        : null;

      const canView = canViewPlaceDetail({
        actor: query.actor ?? null,
        publicationStatus: place.getPublicationStatus(),
        visibility: place.getVisibility(),
        membership,
      });

      if (canView) {
        return {
          mimeType: mediaAsset.getMimeType(),
          originalFilename: mediaAsset.getOriginalFilename(),
          storageKey: mediaAsset.getStorageKey(),
        };
      }
    }

    throw new ForbiddenError("You do not have access to this media asset.");
  }
}
