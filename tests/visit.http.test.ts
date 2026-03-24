import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../src/shared/errors/app-error";
import { errorHandlerMiddleware } from "../src/interfaces/http/middlewares/error-handler.middleware";

const handlers = {
  startVisit: { execute: vi.fn() },
  endVisit: { execute: vi.fn() },
  getPlaceVisitSummary: { execute: vi.fn() },
  getMyActiveVisit: { execute: vi.fn() },
};

vi.mock("../src/application/visit/visit.module.js", () => ({
  buildVisitModule: vi.fn(() => handlers),
}));

import { createVisitRoute } from "../src/interfaces/http/routes/visit.route";

describe("Visit routes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("GET /places/:placeId/visit-summary returns 200 anonymously", async () => {
    handlers.getPlaceVisitSummary.execute.mockResolvedValue({
      placeId: "place_123",
      activeVisits: 0,
      totalVisits: 0,
      visitsLast24Hours: 0,
      lastVisitStartedAt: null,
    });

    const app = express();
    app.use(express.json());
    app.use(
      createVisitRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app).get("/places/place_123/visit-summary").expect(200);

    expect(response.body).toEqual({
      placeId: "place_123",
      activeVisits: 0,
      totalVisits: 0,
      visitsLast24Hours: 0,
      lastVisitStartedAt: null,
    });
  });

  it("POST /places/:placeId/visits/start returns 401 when auth is missing", async () => {
    const app = express();
    app.use(express.json());
    app.use(
      createVisitRoute({
        prisma: {} as never,
        attachAuthContext: (_req, _res, next) => next(),
        requireAuth: (_req, _res, next) => next(new UnauthorizedError("Authentication required")),
        resolveCurrentUser: (_req, _res, next) => next(),
      }),
    );
    app.use(errorHandlerMiddleware);

    const response = await request(app).post("/places/place_123/visits/start").expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});
