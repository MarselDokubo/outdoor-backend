import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

const handlers = {
  listNearbyHotspots: { execute: vi.fn() },
  getPlaceHotspot: { execute: vi.fn() },
};

vi.mock("../src/application/discovery/discovery.module.js", () => ({
  buildDiscoveryModule: vi.fn(() => handlers),
}));

import { createDiscoveryRoute } from "../src/interfaces/http/routes/discovery.route.js";

describe("Discovery routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /discovery/hotspots/nearby returns 200", async () => {
    handlers.listNearbyHotspots.execute.mockResolvedValue([
      {
        cellId: "892a100d2d7ffff",
        center: {
          latitude: 4.8156,
          longitude: 7.0498,
        },
        score: 12.5,
        placeCount: 1,
        topPlaces: [],
      },
    ]);

    const app = express();
    app.use(express.json());
    app.use(
      createDiscoveryRoute({
        prisma: {} as never,
      }),
    );

    const response = await request(app)
      .get("/discovery/hotspots/nearby?latitude=4.8156&longitude=7.0498&radiusMeters=3000&limit=10")
      .expect(200);

    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items).toHaveLength(1);
    expect(handlers.listNearbyHotspots.execute).toHaveBeenCalledTimes(1);
  });

  it("GET /places/:placeId/hotspot returns 200", async () => {
    handlers.getPlaceHotspot.execute.mockResolvedValue({
      placeId: "place_123",
      window: "DAY_1",
      score: 18.2,
      rank: 3,
      cellId: "892a100d2d7ffff",
      generatedAt: new Date().toISOString(),
    });

    const app = express();
    app.use(express.json());
    app.use(
      createDiscoveryRoute({
        prisma: {} as never,
      }),
    );

    const response = await request(app).get("/places/place_123/hotspot?window=DAY_1").expect(200);

    expect(response.body.window).toBe("DAY_1");
    expect(response.body.placeId).toBe("place_123");
    expect(handlers.getPlaceHotspot.execute).toHaveBeenCalledTimes(1);
  });
});
