import type { MediaAsset } from "../media-asset.js";
import type { MediaAttachment } from "../media-attachment.js";
import type { MediaAttachmentOwnerType } from "../media.enums.js";

export interface AttachedMediaRecord {
  asset: MediaAsset;
  attachment: MediaAttachment;
}

export interface MediaAttachmentRepository {
  save(mediaAttachment: MediaAttachment): Promise<void>;
  findActiveForOwner(
    ownerType: MediaAttachmentOwnerType,
    ownerId: string,
  ): Promise<AttachedMediaRecord[]>;
  findActiveForOwnerAndMedia(
    ownerType: MediaAttachmentOwnerType,
    ownerId: string,
    mediaAssetId: string,
  ): Promise<AttachedMediaRecord | null>;
  findActiveForMedia(mediaAssetId: string): Promise<AttachedMediaRecord[]>;
  countActiveForMedia(mediaAssetId: string): Promise<number>;
}
