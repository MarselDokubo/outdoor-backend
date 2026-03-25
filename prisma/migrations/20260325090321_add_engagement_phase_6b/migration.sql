-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('ACTIVE', 'DELETED');

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "targetType" "EngagementTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'ACTIVE',
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_targetType_targetId_createdAt_idx" ON "Comment"("targetType", "targetId", "createdAt" ASC);

-- CreateIndex
CREATE INDEX "Comment_targetType_targetId_status_createdAt_idx" ON "Comment"("targetType", "targetId", "status", "createdAt" ASC);

-- CreateIndex
CREATE INDEX "Comment_authorUserId_createdAt_idx" ON "Comment"("authorUserId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
