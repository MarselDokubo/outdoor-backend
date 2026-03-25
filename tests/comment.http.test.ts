import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../src/shared/errors/app-error.js";
import { errorHandlerMiddleware } from "../src/interfaces/http/middlewares/error-handler.middleware.js";

const handlers = {
  createComment: { execute: vi.fn() },
  updateComment: { execute: vi.fn() },
  deleteComment: { execute: vi.fn() },
  getCommentDetails: { execute: vi.fn() },
  listTargetComments: { execute: vi.fn() },
  listMyComments: { execute: vi.fn() },
};

vi.mock("../src/application/engagement/comment.module.js", () => ({
  buildCommentModule: vi.fn(() => handlers),
}));

import { createCommentRoute } from "../src/interfaces/http/routes/comment.route.js";

describe("Comment routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /posts/:postId/comments returns 200 anonymously", async () => {
    handlers.listTargetComments.execute.mockResolvedValue({
      items: [],
    });

    const app = express();
    app.use(express.json());
    app.use(
      createCommentRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );

    const response = await request(app).get("/posts/post_123/comments").expect(200);

    expect(response.body).toEqual({ items: [] });
  });

  it("POST /comments returns 401 when auth is missing", async () => {
    const app = express();
    app.use(express.json());
    app.use(
      createCommentRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(new UnauthorizedError("Authentication required")),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app)
      .post("/comments")
      .send({
        targetType: "POST",
        targetId: "post_123",
        body: "Nice post",
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});
