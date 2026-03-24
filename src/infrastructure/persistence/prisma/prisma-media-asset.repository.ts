import type { MediaAsset } from "../../../domain/media/media-asset.js";
import type { MediaAssetRepository } from "../../../domain/media/repositories/index.js";
import type { MediaPrismaClient, MediaPrismaTransactionClient } from "./media-prisma.types.js";
import { toMediaAssetEntity, toMediaAssetPersistence } from "./media-mappers.js";

type PrismaDb = MediaPrismaClient | MediaPrismaTransactionClient;

export class PrismaMediaAssetRepository implements MediaAssetRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findById(mediaAssetId: string): Promise<MediaAsset | null> {
    const record = await this.db.mediaAsset.findUnique({
      where: { id: mediaAssetId },
    });

    return record ? toMediaAssetEntity(record) : null;
  }

  public async save(mediaAsset: MediaAsset): Promise<void> {
    const data = toMediaAssetPersistence(mediaAsset);

    await this.db.mediaAsset.upsert({
      where: { id: data.id },
      update: {
        mimeType: data.mimeType,
        originalFilename: data.originalFilename,
        storageKey: data.storageKey,
        sizeBytes: data.sizeBytes,
        checksumSha256: data.checksumSha256,
        width: data.width,
        height: data.height,
        durationSeconds: data.durationSeconds,
        processingStatus: data.processingStatus,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
      },
      create: data,
    });
  }
}
