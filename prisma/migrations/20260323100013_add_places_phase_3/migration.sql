-- CreateEnum
CREATE TYPE "PlacePublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PlaceVisibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "PlaceSourceType" AS ENUM ('USER_SUBMITTED', 'CURATED', 'IMPORTED');

-- CreateEnum
CREATE TYPE "PlaceClaimStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "PlaceOwnerRole" AS ENUM ('OWNER', 'MANAGER');

-- CreateEnum
CREATE TYPE "PlaceOwnerMembershipStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "shortDescription" TEXT,
    "fullDescription" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "area" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "countryCode" TEXT NOT NULL,
    "formattedAddress" TEXT,
    "publicationStatus" "PlacePublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "PlaceVisibility" NOT NULL DEFAULT 'PRIVATE',
    "sourceType" "PlaceSourceType" NOT NULL DEFAULT 'USER_SUBMITTED',
    "officialTagline" TEXT,
    "officialSummary" TEXT,
    "isOwnerManaged" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceClaim" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "claimantUserId" TEXT NOT NULL,
    "proofReferences" JSONB NOT NULL,
    "status" "PlaceClaimStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedByUserId" TEXT,
    "reviewNotes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaceClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceOwnerMembership" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "PlaceOwnerRole" NOT NULL,
    "status" "PlaceOwnerMembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedByUserId" TEXT NOT NULL,

    CONSTRAINT "PlaceOwnerMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_slug_key" ON "Place"("slug");

-- CreateIndex
CREATE INDEX "Place_publicationStatus_visibility_idx" ON "Place"("publicationStatus", "visibility");

-- CreateIndex
CREATE INDEX "Place_categoryCode_idx" ON "Place"("categoryCode");

-- CreateIndex
CREATE INDEX "Place_latitude_longitude_idx" ON "Place"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Place_name_idx" ON "Place"("name");

-- CreateIndex
CREATE INDEX "Place_city_idx" ON "Place"("city");

-- CreateIndex
CREATE INDEX "Place_area_idx" ON "Place"("area");

-- CreateIndex
CREATE INDEX "PlaceClaim_placeId_status_idx" ON "PlaceClaim"("placeId", "status");

-- CreateIndex
CREATE INDEX "PlaceClaim_claimantUserId_status_idx" ON "PlaceClaim"("claimantUserId", "status");

-- CreateIndex
CREATE INDEX "PlaceClaim_submittedAt_idx" ON "PlaceClaim"("submittedAt");

-- CreateIndex
CREATE INDEX "PlaceOwnerMembership_userId_status_idx" ON "PlaceOwnerMembership"("userId", "status");

-- CreateIndex
CREATE INDEX "PlaceOwnerMembership_placeId_status_idx" ON "PlaceOwnerMembership"("placeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceOwnerMembership_placeId_userId_key" ON "PlaceOwnerMembership"("placeId", "userId");

-- AddForeignKey
ALTER TABLE "PlaceClaim" ADD CONSTRAINT "PlaceClaim_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceOwnerMembership" ADD CONSTRAINT "PlaceOwnerMembership_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
