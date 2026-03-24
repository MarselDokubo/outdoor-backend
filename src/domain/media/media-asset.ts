import {
  MEDIA_KINDS,
  MEDIA_PROCESSING_STATUSES,
  type MediaKind,
  type MediaProcessingStatus,
} from "./media.enums.js";
import { MediaConflictError, MediaValidationError } from "./media.errors.js";

export interface CreateMediaAssetProps {
  id: string;
  uploaderUserId: string;
  kind: MediaKind;
  mimeType: string;
  originalFilename: string;
  storageKey: string;
  sizeBytes: number;
  checksumSha256: string;
  width?: number | null | undefined;
  height?: number | null | undefined;
  durationSeconds?: number | null | undefined;
  processingStatus?: MediaProcessingStatus | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  deletedAt?: Date | null | undefined;
}

export type RehydrateMediaAssetProps = CreateMediaAssetProps;

export class MediaAsset {
  private constructor(
    public readonly id: string,
    public readonly uploaderUserId: string,
    private readonly kind: MediaKind,
    private readonly mimeType: string,
    private readonly originalFilename: string,
    private readonly storageKey: string,
    private readonly sizeBytes: number,
    private readonly checksumSha256: string,
    private readonly width: number | null,
    private readonly height: number | null,
    private readonly durationSeconds: number | null,
    private processingStatus: MediaProcessingStatus,
    public readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null,
  ) {}

  public static create(props: CreateMediaAssetProps): MediaAsset {
    if (!props.id.trim()) {
      throw new MediaValidationError("Media asset id is required.");
    }

    if (!props.uploaderUserId.trim()) {
      throw new MediaValidationError("Media uploader user id is required.");
    }

    if (!MEDIA_KINDS.includes(props.kind)) {
      throw new MediaValidationError("Invalid media kind.", {
        allowedValues: MEDIA_KINDS,
      });
    }

    if (!props.mimeType.trim()) {
      throw new MediaValidationError("Media mime type is required.");
    }

    if (!props.originalFilename.trim()) {
      throw new MediaValidationError("Original filename is required.");
    }

    if (!props.storageKey.trim()) {
      throw new MediaValidationError("Storage key is required.");
    }

    if (props.sizeBytes <= 0) {
      throw new MediaValidationError("Media size must be greater than zero.");
    }

    if (!props.checksumSha256.trim()) {
      throw new MediaValidationError("Checksum is required.");
    }

    const status = props.processingStatus ?? "READY";
    if (!MEDIA_PROCESSING_STATUSES.includes(status)) {
      throw new MediaValidationError("Invalid media processing status.", {
        allowedValues: MEDIA_PROCESSING_STATUSES,
      });
    }

    return new MediaAsset(
      props.id,
      props.uploaderUserId,
      props.kind,
      props.mimeType.trim().toLowerCase(),
      props.originalFilename.trim(),
      props.storageKey.trim(),
      props.sizeBytes,
      props.checksumSha256.trim(),
      normalizeNullableNumber(props.width),
      normalizeNullableNumber(props.height),
      normalizeNullableNumber(props.durationSeconds),
      status,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.deletedAt ?? null,
    );
  }

  public static rehydrate(props: RehydrateMediaAssetProps): MediaAsset {
    return MediaAsset.create(props);
  }

  public markReady(): void {
    this.ensureNotDeleted();
    this.processingStatus = "READY";
    this.touch();
  }

  public markFailed(): void {
    this.ensureNotDeleted();
    this.processingStatus = "FAILED";
    this.touch();
  }

  public markDeleted(): void {
    if (this.deletedAt) {
      return;
    }

    this.deletedAt = new Date();
    this.processingStatus = "DELETED";
    this.touch();
  }

  public isReady(): boolean {
    return this.processingStatus === "READY" && !this.deletedAt;
  }

  public isDeleted(): boolean {
    return Boolean(this.deletedAt);
  }

  public getKind(): MediaKind {
    return this.kind;
  }

  public getMimeType(): string {
    return this.mimeType;
  }

  public getOriginalFilename(): string {
    return this.originalFilename;
  }

  public getStorageKey(): string {
    return this.storageKey;
  }

  public getSizeBytes(): number {
    return this.sizeBytes;
  }

  public getChecksumSha256(): string {
    return this.checksumSha256;
  }

  public getWidth(): number | null {
    return this.width;
  }

  public getHeight(): number | null {
    return this.height;
  }

  public getDurationSeconds(): number | null {
    return this.durationSeconds;
  }

  public getProcessingStatus(): MediaProcessingStatus {
    return this.processingStatus;
  }

  public toPrimitives() {
    return {
      id: this.id,
      uploaderUserId: this.uploaderUserId,
      kind: this.kind,
      mimeType: this.mimeType,
      originalFilename: this.originalFilename,
      storageKey: this.storageKey,
      sizeBytes: this.sizeBytes,
      checksumSha256: this.checksumSha256,
      width: this.width,
      height: this.height,
      durationSeconds: this.durationSeconds,
      processingStatus: this.processingStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  private ensureNotDeleted(): void {
    if (this.deletedAt) {
      throw new MediaConflictError("Deleted media assets cannot be changed.");
    }
  }
}

function normalizeNullableNumber(value?: number | null): number | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (!Number.isFinite(value) || value < 0) {
    throw new MediaValidationError("Media numeric metadata must be a non-negative finite number.");
  }

  return value;
}
