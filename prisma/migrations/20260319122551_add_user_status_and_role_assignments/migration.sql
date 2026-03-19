-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'suspended', 'deactivated');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastSeenAt" TIMESTAMP(3),
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "UserRoleAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "SystemRole" NOT NULL,
    "assignedBy" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "UserRoleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserRoleAssignment_userId_idx" ON "UserRoleAssignment"("userId");

-- CreateIndex
CREATE INDEX "UserRoleAssignment_role_idx" ON "UserRoleAssignment"("role");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleAssignment_userId_role_key" ON "UserRoleAssignment"("userId", "role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- AddForeignKey
ALTER TABLE "UserRoleAssignment" ADD CONSTRAINT "UserRoleAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill status from legacy isActive
UPDATE "User"
SET "status" = CASE
  WHEN "isActive" = true THEN 'active'::"UserStatus"
  ELSE 'suspended'::"UserStatus"
END;

-- Backfill role assignments from legacy single role
INSERT INTO "UserRoleAssignment" ("id", "userId", "role", "assignedAt", "reason")
SELECT
  'backfill_' || "id" || '_' || "role"::text,
  "id",
  "role",
  NOW(),
  'Backfilled from legacy User.role'
FROM "User"
ON CONFLICT ("userId", "role") DO NOTHING;
