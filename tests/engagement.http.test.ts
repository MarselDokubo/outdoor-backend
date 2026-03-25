import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../src/shared/errors/app-error.js";
import { errorHandlerMiddleware } from "../src/interfaces/http/middlewares/error-handler.middleware.js";

const handlers = {
  reactToTarget: { execute: vi.fn() },
  removeReaction: { execute: vi.fn() },
  saveTarget: { execute: vi.fn() },
  removeSave: { execute: vi.fn() },
  getEngagementSummary: { execute: vi.fn() },
  listMySavedItems: { execute: vi.fn() },
};

vi.mock("../src/application/engagement/engagement.module.js", () => ({
  buildEngagementModule: vi.fn(() => handlers),
}));

import { createEngagementRoute } from "../src/interfaces/http/routes/engagement.route.js";

describe("Engagement routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /posts/:postId/engagement returns 200 anonymously", async () => {
    handlers.getEngagementSummary.execute.mockResolvedValue({
      targetType: "POST",
      targetId: "post_123",
      totalReactions: 2,
      savesCount: 1,
      reactionsByType: { LIKE: 1, FIRE: 1 },
      viewerReactionType: null,
      viewerHasSaved: false,
    });

    const app = express();
    app.use(express.json());
    app.use(
      createEngagementRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );

    const response = await request(app).get("/posts/post_123/engagement").expect(200);
    expect(response.body.targetId).toBe("post_123");
    expect(response.body.totalReactions).toBe(2);
  });

  it("POST /engagement/reactions returns 401 when auth is missing", async () => {
    const app = express();
    app.use(express.json());
    app.use(
      createEngagementRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(new UnauthorizedError("Authentication required")),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app)
      .post("/engagement/reactions")
      .send({ targetType: "POST", targetId: "post_123", reactionType: "LIKE" })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});
