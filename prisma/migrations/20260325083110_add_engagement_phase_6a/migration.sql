-- CreateEnum
CREATE TYPE "EventVisibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EngagementTargetType" AS ENUM ('PLACE', 'POST', 'EVENT');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'INTERESTED', 'FIRE');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "hostUserId" TEXT NOT NULL,
    "placeId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "visibility" "EventVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" "EngagementTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "reactionType" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Save" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" "EngagementTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Save_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_placeId_status_visibility_startsAt_idx" ON "Event"("placeId", "status", "visibility", "startsAt");

-- CreateIndex
CREATE INDEX "Event_hostUserId_createdAt_idx" ON "Event"("hostUserId", "createdAt");

-- CreateIndex
CREATE INDEX "reaction_target_idx" ON "Reaction"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "reaction_user_created_idx" ON "Reaction"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "reaction_user_target_unique" ON "Reaction"("userId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "save_target_idx" ON "Save"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "save_user_created_idx" ON "Save"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "save_user_target_unique" ON "Save"("userId", "targetType", "targetId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
