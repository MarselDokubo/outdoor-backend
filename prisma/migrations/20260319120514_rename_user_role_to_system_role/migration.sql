/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('user', 'creator', 'moderator', 'admin', 'super_admin');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "SystemRole" NOT NULL DEFAULT 'user';

-- DropEnum
DROP TYPE "UserRole";

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");
