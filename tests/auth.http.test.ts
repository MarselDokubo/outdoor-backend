import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";
import type { AuthContext } from "../src/shared/auth/auth-context";

vi.mock("../src/shared/auth/oidc", () => ({
  verifyAccessToken: vi.fn(),
}));

import { verifyAccessToken } from "../src/shared/auth/oidc";

const mockedVerifyAccessToken = vi.mocked(verifyAccessToken);

function buildAuthContext(overrides: Partial<AuthContext> = {}): AuthContext {
  return {
    provider: "oidc",
    subject: "provider|user-123",
    issuer: "https://issuer.example.com",
    audience: "outdoor-backend",
    roles: ["user"],
    claims: {},
    ...overrides,
  };
}

describe("Auth routes", () => {
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

  beforeEach(() => {
    mockedVerifyAccessToken.mockReset();
  });

  it("GET /auth/me returns 401 when token is missing", async () => {
    const response = await request(app).get("/auth/me").expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /auth/me returns 401 when token is invalid", async () => {
    mockedVerifyAccessToken.mockRejectedValue(new Error("invalid token"));

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer bad-token")
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /auth/me returns 200 with auth context when token is valid", async () => {
    mockedVerifyAccessToken.mockResolvedValue(
      buildAuthContext({
        email: "user@example.com",
        emailVerified: true,
        roles: ["user"],
      }),
    );

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer valid-token")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.subject).toBe("provider|user-123");
    expect(response.body.data.user.email).toBe("user@example.com");
    expect(response.body.data.user.roles).toEqual(["user"]);
  });

  it("GET /auth/admin-test returns 403 when user lacks admin role", async () => {
    mockedVerifyAccessToken.mockResolvedValue(
      buildAuthContext({
        roles: ["user"],
      }),
    );

    const response = await request(app)
      .get("/auth/admin-test")
      .set("Authorization", "Bearer valid-token")
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("GET /auth/admin-test returns 200 for admin user", async () => {
    mockedVerifyAccessToken.mockResolvedValue(
      buildAuthContext({
        roles: ["admin"],
      }),
    );

    const response = await request(app)
      .get("/auth/admin-test")
      .set("Authorization", "Bearer valid-token")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe("Admin authorization check passed");
    expect(response.body.data.user.roles).toEqual(["admin"]);
  });
});
