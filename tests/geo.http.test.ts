import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("Geo routes", () => {
  const fakePrisma = {
    $queryRawUnsafe: async () => 1,
  } as any;

  const fakeRedis = {
    ping: async () => "PONG",
  } as any;

  const app = createApp({ prisma: fakePrisma, redis: fakeRedis });

  it("POST /geo/validate-point returns normalized point", async () => {
    const response = await request(app)
      .post("/geo/validate-point")
      .send({ latitude: 4.8156, longitude: 7.0498 })
      .expect(200);

    expect(response.body.data.point).toEqual({
      latitude: 4.8156,
      longitude: 7.0498,
    });
  });

  it("POST /geo/geocode returns matches", async () => {
    const response = await request(app)
      .post("/geo/geocode")
      .send({ query: "Port Harcourt" })
      .expect(200);

    expect(response.body.data.results.length).toBeGreaterThan(0);
  });

  it("POST /geo/reverse-geocode returns nearby location metadata", async () => {
    const response = await request(app)
      .post("/geo/reverse-geocode")
      .send({ latitude: 4.8156, longitude: 7.0498 })
      .expect(200);

    expect(response.body.data.result.city.citySlug).toBe("port-harcourt");
  });
  it("POST /geo/validate-point returns 400 for invalid coordinates", async () => {
    const response = await request(app)
      .post("/geo/validate-point")
      .send({ latitude: "abc", longitude: 7.0498 })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });

  it("POST /geo/geocode returns 400 for empty query", async () => {
    const response = await request(app).post("/geo/geocode").send({ query: "   " }).expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });

  it("POST /geo/reverse-geocode returns 400 for invalid latitude range", async () => {
    const response = await request(app)
      .post("/geo/reverse-geocode")
      .send({ latitude: 500, longitude: 7.0498 })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });
});
