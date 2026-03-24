import type { MediaAsset } from "../media-asset.js";

export interface MediaAssetRepository {
  findById(mediaAssetId: string): Promise<MediaAsset | null>;
  save(mediaAsset: MediaAsset): Promise<void>;
}
