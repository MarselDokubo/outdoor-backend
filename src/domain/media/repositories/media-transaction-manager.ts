import type { MediaAssetRepository } from "./media-asset.repository.js";
import type { MediaAttachmentRepository } from "./media-attachment.repository.js";

export interface MediaTransactionalRepos {
  mediaAssets: MediaAssetRepository;
  mediaAttachments: MediaAttachmentRepository;
}

export interface MediaTransactionManager {
  withTransaction<T>(work: (repos: MediaTransactionalRepos) => Promise<T>): Promise<T>;
}
