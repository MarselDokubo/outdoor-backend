import type { PrismaClient } from "../src/generated/prisma/client";
import type { RedisClientType } from "redis";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createApp } from "../src/app";

function createPrismaMock() {
  const placeFindMany = vi.fn().mockResolvedValue([]);
  const queryRaw = vi.fn().mockResolvedValue([]);

  const prisma = {
    place: {
      findMany: placeFindMany,
    },
    $queryRaw: queryRaw,
  } as unknown as PrismaClient;

  return {
    prisma,
    placeFindMany,
    queryRaw,
  };
}

function createRedisMock(): RedisClientType {
  return {} as RedisClientType;
}

describe("Place routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /places/search returns 200 for anonymous requests", async () => {
    const { prisma, placeFindMany } = createPrismaMock();
    const app = createApp({
      prisma,
      redis: createRedisMock(),
    });

    const response = await request(app).get("/places/search").query({ q: "port" }).expect(200);

    expect(response.body).toEqual({
      items: [],
      nextCursor: null,
    });

    expect(placeFindMany).toHaveBeenCalledTimes(1);
  });

  it("GET /places/nearby returns 200 for anonymous requests", async () => {
    const { prisma, queryRaw } = createPrismaMock();
    const app = createApp({
      prisma,
      redis: createRedisMock(),
    });

    const response = await request(app)
      .get("/places/nearby")
      .query({
        latitude: 4.8156,
        longitude: 7.0498,
        radiusMeters: 3000,
      })
      .expect(200);

    expect(response.body).toEqual({
      items: [],
    });

    expect(queryRaw).toHaveBeenCalledTimes(1);
  });

  it("POST /places returns 401 when authentication is missing", async () => {
    const { prisma } = createPrismaMock();
    const app = createApp({
      prisma,
      redis: createRedisMock(),
    });

    const response = await request(app)
      .post("/places")
      .send({
        name: "Portside Lounge",
        category: "LOUNGE",
        location: {
          latitude: 4.8156,
          longitude: 7.0498,
          addressLine1: "12 Abacha Road",
          city: "Port Harcourt",
          state: "Rivers",
          countryCode: "NG",
          formattedAddress: "12 Abacha Road, Port Harcourt, Rivers, Nigeria",
        },
        visibility: "PUBLIC",
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
    expect(response.body.error.message).toBe("Authentication required");
  });
});
