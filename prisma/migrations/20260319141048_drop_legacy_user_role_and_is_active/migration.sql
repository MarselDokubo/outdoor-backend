/*
  Warnings:

  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_isActive_idx";

-- DropIndex
DROP INDEX "User_role_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
DROP COLUMN "role";
