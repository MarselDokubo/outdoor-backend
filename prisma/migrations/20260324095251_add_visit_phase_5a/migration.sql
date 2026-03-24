-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VisitSourceType" AS ENUM ('MANUAL_CHECK_IN', 'SYSTEM_DETECTED');

-- CreateTable
CREATE TABLE "Visit" (
    "id" VARCHAR(50) NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "placeId" VARCHAR(50) NOT NULL,
    "status" "VisitStatus" NOT NULL,
    "sourceType" "VisitSourceType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "confidenceScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visit_userId_status_idx" ON "Visit"("userId", "status");

-- CreateIndex
CREATE INDEX "Visit_placeId_status_idx" ON "Visit"("placeId", "status");

-- CreateIndex
CREATE INDEX "Visit_placeId_startedAt_idx" ON "Visit"("placeId", "startedAt");

-- CreateIndex
CREATE INDEX "Visit_userId_startedAt_idx" ON "Visit"("userId", "startedAt");
