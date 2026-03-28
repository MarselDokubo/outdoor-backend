-- CreateEnum
CREATE TYPE "HotspotWindowType" AS ENUM ('LAST_30_MINUTES', 'LAST_2_HOURS', 'LAST_24_HOURS');

-- CreateTable
CREATE TABLE "HotspotSnapshot" (
    "id" VARCHAR(50) NOT NULL,
    "cellId" VARCHAR(32) NOT NULL,
    "h3Resolution" INTEGER NOT NULL,
    "windowType" "HotspotWindowType" NOT NULL,
    "windowStartedAt" TIMESTAMP(3) NOT NULL,
    "windowEndedAt" TIMESTAMP(3) NOT NULL,
    "centerLatitude" DOUBLE PRECISION NOT NULL,
    "centerLongitude" DOUBLE PRECISION NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER,
    "placeCount" INTEGER NOT NULL DEFAULT 0,
    "uniqueActorCount" INTEGER NOT NULL DEFAULT 0,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "saveCount" INTEGER NOT NULL DEFAULT 0,
    "impressionCount" INTEGER NOT NULL DEFAULT 0,
    "followCount" INTEGER NOT NULL DEFAULT 0,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "city" TEXT,
    "area" TEXT,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotspotSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotspotPlacePlacement" (
    "hotspotId" VARCHAR(50) NOT NULL,
    "placeId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HotspotPlacePlacement_pkey" PRIMARY KEY ("hotspotId","placeId")
);

-- CreateIndex
CREATE INDEX "idx_hotspot_snapshot_window_rank" ON "HotspotSnapshot"("windowType", "windowEndedAt", "rank");

-- CreateIndex
CREATE INDEX "idx_hotspot_snapshot_window_score" ON "HotspotSnapshot"("windowType", "windowEndedAt", "score" DESC);

-- CreateIndex
CREATE INDEX "idx_hotspot_snapshot_city_area_window" ON "HotspotSnapshot"("city", "area", "windowType", "windowEndedAt");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hotspot_snapshot_cell_window" ON "HotspotSnapshot"("cellId", "h3Resolution", "windowType", "windowEndedAt");

-- CreateIndex
CREATE INDEX "idx_hotspot_place_rank" ON "HotspotPlacePlacement"("placeId", "rank");

-- CreateIndex
CREATE INDEX "idx_hotspot_placement_rank" ON "HotspotPlacePlacement"("hotspotId", "rank");

-- AddForeignKey
ALTER TABLE "HotspotPlacePlacement" ADD CONSTRAINT "HotspotPlacePlacement_hotspotId_fkey" FOREIGN KEY ("hotspotId") REFERENCES "HotspotSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotspotPlacePlacement" ADD CONSTRAINT "HotspotPlacePlacement_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
