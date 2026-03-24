import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../src/shared/errors/app-error";
import { errorHandlerMiddleware } from "../src/interfaces/http/middlewares/error-handler.middleware";

const handlers = {
  createEvent: { execute: vi.fn() },
  updateEvent: { execute: vi.fn() },
  publishEvent: { execute: vi.fn() },
  cancelEvent: { execute: vi.fn() },
  archiveEvent: { execute: vi.fn() },
  getEventDetails: { execute: vi.fn() },
  listPlaceEvents: { execute: vi.fn() },
  listMyEvents: { execute: vi.fn() },
};

vi.mock("../src/application/event/event.module.js", () => ({
  buildEventModule: vi.fn(() => handlers),
}));

import { createEventRoute } from "../src/interfaces/http/routes/event.route";

describe("Event routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /places/:placeId/events returns 200 anonymously", async () => {
    handlers.listPlaceEvents.execute.mockResolvedValue([]);

    const app = express();
    app.use(express.json());
    app.use(
      createEventRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app).get("/places/place_123/events").expect(200);

    expect(response.body).toEqual({ items: [] });
  });

  it("POST /events returns 401 when auth is missing", async () => {
    const app = express();
    app.use(express.json());
    app.use(
      createEventRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(new UnauthorizedError("Authentication required")),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app)
      .post("/events")
      .send({
        title: "Sunset Rooftop Session",
        startsAt: "2026-04-01T18:00:00.000Z",
        endsAt: "2026-04-01T21:00:00.000Z",
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});
