-- CreateTable
CREATE TABLE "Impression" (
    "id" VARCHAR(50) NOT NULL,
    "targetType" "EngagementTargetType" NOT NULL,
    "targetId" VARCHAR(50) NOT NULL,
    "viewerUserId" VARCHAR(50),
    "sessionKey" VARCHAR(120),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Impression_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_impression_target_created" ON "Impression"("targetType", "targetId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_impression_viewer_created" ON "Impression"("viewerUserId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_impression_session_created" ON "Impression"("sessionKey", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_impression_target_viewer_created" ON "Impression"("targetType", "targetId", "viewerUserId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_impression_target_session_created" ON "Impression"("targetType", "targetId", "sessionKey", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Impression" ADD CONSTRAINT "Impression_viewerUserId_fkey" FOREIGN KEY ("viewerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
