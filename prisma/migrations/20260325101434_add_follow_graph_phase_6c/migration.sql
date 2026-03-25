-- CreateEnum
CREATE TYPE "FollowTargetType" AS ENUM ('USER', 'PLACE');

-- CreateTable
CREATE TABLE "Follow" (
    "id" VARCHAR(50) NOT NULL,
    "followerUserId" VARCHAR(50) NOT NULL,
    "targetType" "FollowTargetType" NOT NULL,
    "targetId" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_follow_target_created" ON "Follow"("targetType", "targetId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_follow_follower_created" ON "Follow"("followerUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "uq_follow_follower_target" ON "Follow"("followerUserId", "targetType", "targetId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerUserId_fkey" FOREIGN KEY ("followerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
