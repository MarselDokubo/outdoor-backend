import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";

describe("GET /health/live", () => {
  it("returns 200 with a liveness payload", async () => {
    const fakePrisma = {
      $queryRawUnsafe: vi.fn().mockResolvedValue(1),
    } as any;

    const fakeRedis = {
      ping: vi.fn().mockResolvedValue("PONG"),
    } as any;

    const app = createApp({
      prisma: fakePrisma,
      redis: fakeRedis,
    });

    const response = await request(app).get("/health/live").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.data.service).toBe("outdoor-backend");
    expect(typeof response.body.requestId).toBe("string");
  });
});
