import {
  MEDIA_ATTACHMENT_OWNER_TYPES,
  MEDIA_ATTACHMENT_ROLES,
  type MediaAttachmentOwnerType,
  type MediaAttachmentRole,
} from "./media.enums.js";
import { MediaConflictError, MediaValidationError } from "./media.errors.js";

export interface CreateMediaAttachmentProps {
  id: string;
  mediaAssetId: string;
  ownerType: MediaAttachmentOwnerType;
  ownerId: string;
  role: MediaAttachmentRole;
  sortOrder?: number | undefined;
  attachedByUserId: string;
  createdAt?: Date | undefined;
  detachedAt?: Date | null | undefined;
}

export type RehydrateMediaAttachmentProps = CreateMediaAttachmentProps;

export class MediaAttachment {
  private constructor(
    public readonly id: string,
    public readonly mediaAssetId: string,
    private readonly ownerType: MediaAttachmentOwnerType,
    private readonly ownerId: string,
    private role: MediaAttachmentRole,
    private sortOrder: number,
    public readonly attachedByUserId: string,
    public readonly createdAt: Date,
    private detachedAt: Date | null,
  ) {}

  public static create(props: CreateMediaAttachmentProps): MediaAttachment {
    if (!props.id.trim()) {
      throw new MediaValidationError("Media attachment id is required.");
    }

    if (!props.mediaAssetId.trim()) {
      throw new MediaValidationError("Media asset id is required.");
    }

    if (!MEDIA_ATTACHMENT_OWNER_TYPES.includes(props.ownerType)) {
      throw new MediaValidationError("Invalid media attachment owner type.", {
        allowedValues: MEDIA_ATTACHMENT_OWNER_TYPES,
      });
    }

    if (!props.ownerId.trim()) {
      throw new MediaValidationError("Media attachment owner id is required.");
    }

    if (!MEDIA_ATTACHMENT_ROLES.includes(props.role)) {
      throw new MediaValidationError("Invalid media attachment role.", {
        allowedValues: MEDIA_ATTACHMENT_ROLES,
      });
    }

    if (!props.attachedByUserId.trim()) {
      throw new MediaValidationError("Attached by user id is required.");
    }

    const sortOrder = props.sortOrder ?? 0;
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      throw new MediaValidationError("Media attachment sort order must be a non-negative integer.");
    }

    return new MediaAttachment(
      props.id,
      props.mediaAssetId,
      props.ownerType,
      props.ownerId,
      props.role,
      sortOrder,
      props.attachedByUserId,
      props.createdAt ?? new Date(),
      props.detachedAt ?? null,
    );
  }

  public static rehydrate(props: RehydrateMediaAttachmentProps): MediaAttachment {
    return MediaAttachment.create(props);
  }

  public detach(): void {
    if (this.detachedAt) {
      throw new MediaConflictError("Media attachment is already detached.");
    }

    this.detachedAt = new Date();
  }

  public isActive(): boolean {
    return this.detachedAt === null;
  }

  public getOwnerType(): MediaAttachmentOwnerType {
    return this.ownerType;
  }

  public getOwnerId(): string {
    return this.ownerId;
  }

  public getRole(): MediaAttachmentRole {
    return this.role;
  }

  public getSortOrder(): number {
    return this.sortOrder;
  }

  public getDetachedAt(): Date | null {
    return this.detachedAt;
  }

  public toPrimitives() {
    return {
      id: this.id,
      mediaAssetId: this.mediaAssetId,
      ownerType: this.ownerType,
      ownerId: this.ownerId,
      role: this.role,
      sortOrder: this.sortOrder,
      attachedByUserId: this.attachedByUserId,
      createdAt: this.createdAt,
      detachedAt: this.detachedAt,
    };
  }
}
