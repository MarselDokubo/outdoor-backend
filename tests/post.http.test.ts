import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../src/shared/errors/app-error.js";
import { errorHandlerMiddleware } from "../src/interfaces/http/middlewares/error-handler.middleware.js";

const handlers = {
  createPost: { execute: vi.fn() },
  updatePost: { execute: vi.fn() },
  publishPost: { execute: vi.fn() },
  archivePost: { execute: vi.fn() },
  getPostDetails: { execute: vi.fn() },
  listPlacePosts: { execute: vi.fn() },
  listMyPosts: { execute: vi.fn() },
};

vi.mock("../src/application/post/post.module.js", () => ({
  buildPostModule: vi.fn(() => handlers),
}));

import { createPostRoute } from "../src/interfaces/http/routes/post.route.js";

describe("Post routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /places/:placeId/posts returns 200 anonymously", async () => {
    handlers.listPlacePosts.execute.mockResolvedValue({
      items: [],
      nextCursor: null,
    });

    const app = express();
    app.use(express.json());
    app.use(
      createPostRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app).get("/places/place_123/posts").expect(200);

    expect(response.body).toEqual({
      items: [],
      nextCursor: null,
    });
  });

  it("POST /posts returns 401 when auth is missing", async () => {
    const app = express();
    app.use(express.json());
    app.use(
      createPostRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(new UnauthorizedError("Authentication required")),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app)
      .post("/posts")
      .send({
        placeId: "place_123",
        body: "Port Harcourt is alive tonight.",
        visibility: "PUBLIC",
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});
