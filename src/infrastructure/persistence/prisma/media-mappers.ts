import { MediaAsset } from "../../../domain/media/media-asset.js";
import { MediaAttachment } from "../../../domain/media/media-attachment.js";
import type {
  MediaAttachmentOwnerType,
  MediaAttachmentRole,
  MediaKind,
  MediaProcessingStatus,
} from "../../../domain/media/media.enums.js";

interface MediaAssetRecord {
  id: string;
  uploaderUserId: string;
  kind: MediaKind | string;
  mimeType: string;
  originalFilename: string;
  storageKey: string;
  sizeBytes: number;
  checksumSha256: string;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  processingStatus: MediaProcessingStatus | string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface MediaAttachmentRecord {
  id: string;
  mediaAssetId: string;
  ownerType: MediaAttachmentOwnerType | string;
  ownerId: string;
  role: MediaAttachmentRole | string;
  sortOrder: number;
  attachedByUserId: string;
  createdAt: Date;
  detachedAt: Date | null;
}

export function toMediaAssetEntity(record: MediaAssetRecord): MediaAsset {
  return MediaAsset.rehydrate({
    id: record.id,
    uploaderUserId: record.uploaderUserId,
    kind: record.kind as MediaKind,
    mimeType: record.mimeType,
    originalFilename: record.originalFilename,
    storageKey: record.storageKey,
    sizeBytes: record.sizeBytes,
    checksumSha256: record.checksumSha256,
    width: record.width,
    height: record.height,
    durationSeconds: record.durationSeconds,
    processingStatus: record.processingStatus as MediaProcessingStatus,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    deletedAt: record.deletedAt,
  });
}

export function toMediaAttachmentEntity(record: MediaAttachmentRecord): MediaAttachment {
  return MediaAttachment.rehydrate({
    id: record.id,
    mediaAssetId: record.mediaAssetId,
    ownerType: record.ownerType as MediaAttachmentOwnerType,
    ownerId: record.ownerId,
    role: record.role as MediaAttachmentRole,
    sortOrder: record.sortOrder,
    attachedByUserId: record.attachedByUserId,
    createdAt: record.createdAt,
    detachedAt: record.detachedAt,
  });
}

export function toMediaAssetPersistence(mediaAsset: MediaAsset) {
  return mediaAsset.toPrimitives();
}

export function toMediaAttachmentPersistence(mediaAttachment: MediaAttachment) {
  return mediaAttachment.toPrimitives();
}
