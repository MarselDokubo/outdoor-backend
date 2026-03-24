import type { MediaAttachment } from "../../../domain/media/media-attachment.js";
import type {
  AttachedMediaRecord,
  MediaAttachmentRepository,
} from "../../../domain/media/repositories/index.js";
import type { MediaPrismaClient, MediaPrismaTransactionClient } from "./media-prisma.types.js";
import {
  toMediaAssetEntity,
  toMediaAttachmentEntity,
  toMediaAttachmentPersistence,
} from "./media-mappers.js";

type MediaAttachmentOwnerType = "PLACE" | "POST" | "EVENT";
type PrismaDb = MediaPrismaClient | MediaPrismaTransactionClient;

export class PrismaMediaAttachmentRepository implements MediaAttachmentRepository {
  constructor(private readonly db: PrismaDb) {}

  public async save(mediaAttachment: MediaAttachment): Promise<void> {
    const data = toMediaAttachmentPersistence(mediaAttachment);

    await this.db.mediaAttachment.upsert({
      where: { id: data.id },
      update: {
        role: data.role,
        sortOrder: data.sortOrder,
        detachedAt: data.detachedAt,
      },
      create: data,
    });
  }

  public async findActiveForOwner(
    ownerType: MediaAttachmentOwnerType,
    ownerId: string,
  ): Promise<AttachedMediaRecord[]> {
    const records = await this.db.mediaAttachment.findMany({
      where: {
        ownerType,
        ownerId,
        detachedAt: null,
      },
      include: {
        mediaAsset: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return records.map((record) => ({
      attachment: toMediaAttachmentEntity(record),
      asset: toMediaAssetEntity(record.mediaAsset),
    }));
  }

  public async findActiveForOwnerAndMedia(
    ownerType: MediaAttachmentOwnerType,
    ownerId: string,
    mediaAssetId: string,
  ): Promise<AttachedMediaRecord | null> {
    const record = await this.db.mediaAttachment.findFirst({
      where: {
        ownerType,
        ownerId,
        mediaAssetId,
        detachedAt: null,
      },
      include: {
        mediaAsset: true,
      },
    });

    return record
      ? {
          attachment: toMediaAttachmentEntity(record),
          asset: toMediaAssetEntity(record.mediaAsset),
        }
      : null;
  }

  public async findActiveForMedia(mediaAssetId: string): Promise<AttachedMediaRecord[]> {
    const records = await this.db.mediaAttachment.findMany({
      where: {
        mediaAssetId,
        detachedAt: null,
      },
      include: {
        mediaAsset: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return records.map((record) => ({
      attachment: toMediaAttachmentEntity(record),
      asset: toMediaAssetEntity(record.mediaAsset),
    }));
  }

  public async countActiveForMedia(mediaAssetId: string): Promise<number> {
    return this.db.mediaAttachment.count({
      where: {
        mediaAssetId,
        detachedAt: null,
      },
    });
  }
}
