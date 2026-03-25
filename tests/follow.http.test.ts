import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../src/shared/errors/app-error.js";
import { errorHandlerMiddleware } from "../src/interfaces/http/middlewares/error-handler.middleware.js";

const handlers = {
  followTarget: { execute: vi.fn() },
  unfollowTarget: { execute: vi.fn() },
  listMyFollows: { execute: vi.fn() },
  getUserFollowSummary: { execute: vi.fn() },
  getPlaceFollowSummary: { execute: vi.fn() },
};

vi.mock("../src/application/engagement/follow.module.js", () => ({
  buildFollowModule: vi.fn(() => handlers),
}));

import { createFollowRoute } from "../src/interfaces/http/routes/follow.route.js";

describe("Follow routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /users/:userId/follow-summary returns 200 anonymously", async () => {
    handlers.getUserFollowSummary.execute.mockResolvedValue({
      targetType: "USER",
      targetId: "user_123",
      followersCount: 10,
      isFollowing: false,
      followingCount: 4,
    });

    const app = express();
    app.use(express.json());
    app.use(
      createFollowRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(),
        resolveCurrentUser: (_req, _res, next) => next(),
        optionalAuth: (_req, _res, next) => next(),
      }),
    );

    const response = await request(app).get("/users/user_123/follow-summary").expect(200);

    expect(response.body.targetType).toBe("USER");
    expect(response.body.followersCount).toBe(10);
  });

  it("POST /follows returns 401 when auth is missing", async () => {
    const app = express();
    app.use(express.json());
    app.use(
      createFollowRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(new UnauthorizedError("Authentication required")),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app)
      .post("/follows")
      .send({ targetType: "PLACE", targetId: "place_123" })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});
