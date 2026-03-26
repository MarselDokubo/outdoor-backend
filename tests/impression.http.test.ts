import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { errorHandlerMiddleware } from "../src/interfaces/http/middlewares/error-handler.middleware";

const handlers = {
  recordImpression: { execute: vi.fn() },
  getImpressionSummary: { execute: vi.fn() },
};

vi.mock("../src/application/engagement/impression.module.js", () => ({
  buildImpressionModule: vi.fn(() => handlers),
}));

import { createImpressionRoute } from "../src/interfaces/http/routes/impression.route";

describe("Impression routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /engagement/impressions/summary returns 200 anonymously", async () => {
    handlers.getImpressionSummary.execute.mockResolvedValue({
      targetType: "POST",
      targetId: "post_123",
      totalImpressions: 12,
      impressionsLast24Hours: 5,
      viewerHasViewed: false,
    });

    const app = express();
    app.use(express.json());
    app.use(
      createImpressionRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        optionalAuth: (_req, _res, next) => next(),
      }),
    );

    const response = await request(app)
      .get("/engagement/impressions/summary")
      .query({ targetType: "POST", targetId: "post_123" })
      .expect(200);

    expect(response.body.totalImpressions).toBe(12);
    expect(response.body.viewerHasViewed).toBe(false);
  });

  it("POST /engagement/impressions returns 201 with session key anonymously", async () => {
    handlers.recordImpression.execute.mockResolvedValue({
      id: "impression_123",
      targetType: "POST",
      targetId: "post_123",
      viewerUserId: null,
      sessionKey: "session_12345",
      createdAt: new Date().toISOString(),
    });

    const app = express();
    app.use(express.json());
    app.use(
      createImpressionRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        optionalAuth: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app)
      .post("/engagement/impressions")
      .send({ targetType: "POST", targetId: "post_123", sessionKey: "session_12345" })
      .expect(201);

    expect(response.body.targetType).toBe("POST");
    expect(response.body.sessionKey).toBe("session_12345");
  });
});
