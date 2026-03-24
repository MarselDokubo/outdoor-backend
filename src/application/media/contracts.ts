import type { Actor } from "../../domain/place/place-actor.js";
import type {
  MediaAttachmentRole,
  MediaKind,
  MediaProcessingStatus,
} from "../../domain/media/media.enums.js";

export interface UploadableMediaInput {
  buffer: Buffer;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UploadPlaceMediaCommand {
  actor: Actor;
  placeId: string;
  file: UploadableMediaInput;
  role?: MediaAttachmentRole | undefined;
  sortOrder?: number | undefined;
}

export interface DetachPlaceMediaCommand {
  actor: Actor;
  placeId: string;
  mediaAssetId: string;
}

export interface ListPlaceMediaQuery {
  actor?: Actor | null | undefined;
  placeId: string;
}

export interface GetMediaFileQuery {
  actor?: Actor | null | undefined;
  mediaAssetId: string;
}

export interface PlaceMediaView {
  mediaAssetId: string;
  attachmentId: string;
  role: MediaAttachmentRole;
  sortOrder: number;
  kind: MediaKind;
  mimeType: string;
  originalFilename: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  processingStatus: MediaProcessingStatus;
  url: string;
  createdAt: string;
}

export interface UploadPlaceMediaResult {
  mediaAssetId: string;
  attachmentId: string;
  processingStatus: MediaProcessingStatus;
  url: string;
}

export interface GetMediaFileResult {
  mimeType: string;
  originalFilename: string;
  storageKey: string;
}
