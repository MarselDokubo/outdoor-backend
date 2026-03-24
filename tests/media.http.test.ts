import express from "express";
import type { PrismaClient } from "../src/generated/prisma/client";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMediaRoute } from "../src/interfaces/http/routes/media.route";
import { LocalObjectStorageService } from "../src/infrastructure/storage/local-object-storage.service";
import { attachAuthContext } from "../src/interfaces/http/middlewares/auth.middleware";
import { requireAuth } from "../src/interfaces/http/middlewares/require-auth.middleware";
import {
  resolveOptionalCurrentUser,
  resolveCurrentUser,
} from "../src/interfaces/http/middlewares/resolve-current-user.middleware";

function createPrismaMock() {
  const placeFindUnique = vi.fn().mockResolvedValue({
    id: "place_1",
    slug: "portside-lounge",
    name: "Portside Lounge",
    categoryCode: "LOUNGE",
    shortDescription: null,
    fullDescription: null,
    phone: null,
    email: null,
    website: null,
    latitude: 4.8156,
    longitude: 7.0498,
    addressLine1: "12 Abacha Road",
    addressLine2: null,
    area: null,
    city: "Port Harcourt",
    state: "Rivers",
    postalCode: null,
    countryCode: "NG",
    formattedAddress: "12 Abacha Road, Port Harcourt, Rivers, Nigeria",
    publicationStatus: "PUBLISHED",
    visibility: "PUBLIC",
    sourceType: "USER_SUBMITTED",
    officialTagline: null,
    officialSummary: null,
    isOwnerManaged: false,
    isVerified: false,
    createdByUserId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: null,
  });

  const placeOwnerMembershipFindUnique = vi.fn().mockResolvedValue(null);
  const mediaAttachmentFindMany = vi.fn().mockResolvedValue([]);

  const prisma = {
    place: {
      findUnique: placeFindUnique,
    },
    placeOwnerMembership: {
      findUnique: placeOwnerMembershipFindUnique,
    },
    mediaAttachment: {
      findMany: mediaAttachmentFindMany,
    },
  } as unknown as PrismaClient;

  return {
    prisma,
    placeFindUnique,
    mediaAttachmentFindMany,
  };
}

function createResolverMock() {
  return {
    resolve: vi.fn(),
  } as any;
}

function createApp(prisma: PrismaClient) {
  const app = express();
  const resolver = createResolverMock();

  app.use(
    createMediaRoute({
      prisma: prisma as any,
      storage: new LocalObjectStorageService(),
      attachAuthContext,
      requireAuth,
      resolveCurrentUser: resolveCurrentUser(resolver),
      optionalAuth: resolveOptionalCurrentUser(resolver),
    }),
  );

  return app;
}

describe("Media routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /places/:placeId/media returns 200 for anonymous requests", async () => {
    const { prisma, mediaAttachmentFindMany } = createPrismaMock();
    const app = createApp(prisma);

    const response = await request(app).get("/places/place_1/media").expect(200);

    expect(response.body).toEqual({
      items: [],
    });

    expect(mediaAttachmentFindMany).toHaveBeenCalledTimes(1);
  });

  it("DELETE /places/:placeId/media/:mediaAssetId returns 401 when authentication is missing", async () => {
    const { prisma } = createPrismaMock();
    const app = createApp(prisma);

    await request(app).delete("/places/place_1/media/media_1").expect(401);
  });
});
