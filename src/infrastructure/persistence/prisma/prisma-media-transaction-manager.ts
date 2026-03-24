import type {
  MediaTransactionManager,
  MediaTransactionalRepos,
} from "../../../domain/media/repositories/index.js";
import type { MediaPrismaClient, MediaPrismaTransactionClient } from "./media-prisma.types.js";
import { PrismaMediaAssetRepository } from "./prisma-media-asset.repository.js";
import { PrismaMediaAttachmentRepository } from "./prisma-media-attachment.repository.js";

export class PrismaMediaTransactionManager implements MediaTransactionManager {
  constructor(private readonly prisma: MediaPrismaClient) {}

  public withTransaction<T>(work: (repos: MediaTransactionalRepos) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return work(this.makeRepos(tx as MediaPrismaTransactionClient));
    });
  }

  private makeRepos(tx: MediaPrismaTransactionClient): MediaTransactionalRepos {
    return {
      mediaAssets: new PrismaMediaAssetRepository(tx),
      mediaAttachments: new PrismaMediaAttachmentRepository(tx),
    };
  }
}
