-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "MediaProcessingStatus" AS ENUM ('UPLOADED', 'READY', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "MediaAttachmentOwnerType" AS ENUM ('PLACE', 'POST', 'EVENT');

-- CreateEnum
CREATE TYPE "MediaAttachmentRole" AS ENUM ('PRIMARY', 'GALLERY', 'CONTENT');

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "uploaderUserId" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" INTEGER,
    "processingStatus" "MediaProcessingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAttachment" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "ownerType" "MediaAttachmentOwnerType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "role" "MediaAttachmentRole" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "attachedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detachedAt" TIMESTAMP(3),

    CONSTRAINT "MediaAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_storageKey_key" ON "MediaAsset"("storageKey");

-- CreateIndex
CREATE INDEX "MediaAsset_uploaderUserId_idx" ON "MediaAsset"("uploaderUserId");

-- CreateIndex
CREATE INDEX "MediaAsset_processingStatus_idx" ON "MediaAsset"("processingStatus");

-- CreateIndex
CREATE INDEX "MediaAsset_deletedAt_idx" ON "MediaAsset"("deletedAt");

-- CreateIndex
CREATE INDEX "MediaAttachment_ownerType_ownerId_detachedAt_idx" ON "MediaAttachment"("ownerType", "ownerId", "detachedAt");

-- CreateIndex
CREATE INDEX "MediaAttachment_mediaAssetId_detachedAt_idx" ON "MediaAttachment"("mediaAssetId", "detachedAt");

-- CreateIndex
CREATE INDEX "MediaAttachment_attachedByUserId_idx" ON "MediaAttachment"("attachedByUserId");

-- AddForeignKey
ALTER TABLE "MediaAttachment" ADD CONSTRAINT "MediaAttachment_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
