import { describe, expect, it } from "vitest";
import { MediaAsset } from "../src/domain/media/media-asset.js";
import { MediaAttachment } from "../src/domain/media/media-attachment.js";

describe("Media domain", () => {
  it("creates a ready image media asset", () => {
    const asset = MediaAsset.create({
      id: "media_1",
      uploaderUserId: "user_1",
      kind: "IMAGE",
      mimeType: "image/jpeg",
      originalFilename: "cover.jpg",
      storageKey: "places/place_1/media_1/cover.jpg",
      sizeBytes: 1024,
      checksumSha256: "abc123",
      processingStatus: "READY",
    });

    expect(asset.isReady()).toBe(true);
    expect(asset.getMimeType()).toBe("image/jpeg");
  });

  it("detaches an active media attachment", () => {
    const attachment = MediaAttachment.create({
      id: "attachment_1",
      mediaAssetId: "media_1",
      ownerType: "PLACE",
      ownerId: "place_1",
      role: "GALLERY",
      attachedByUserId: "user_1",
    });

    attachment.detach();

    expect(attachment.isActive()).toBe(false);
    expect(attachment.getDetachedAt()).not.toBeNull();
  });
});
