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
    authIdentity: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      create: vi.fn(),
    },
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
    fakePrisma.authIdentity.findUnique.mockReset();
    fakePrisma.authIdentity.update.mockReset();
    fakePrisma.user.create.mockReset();
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

  it("GET /auth/me returns 200 with internal current user", async () => {
    mockedVerifyAccessToken.mockResolvedValue(
      buildAuthContext({
        email: "user@example.com",
        emailVerified: true,
      }),
    );

    fakePrisma.authIdentity.findUnique.mockResolvedValue({
      id: "identity-1",
      provider: "https://issuer.example.com",
      providerSubject: "provider|user-123",
      providerEmail: "user@example.com",
      emailVerified: true,
      user: {
        id: "user-1",
        email: "user@example.com",
        displayName: "Marsel",
        role: "user",
        isActive: true,
      },
    });

    fakePrisma.authIdentity.update.mockResolvedValue({
      id: "identity-1",
      provider: "https://issuer.example.com",
      providerSubject: "provider|user-123",
      providerEmail: "user@example.com",
      emailVerified: true,
      user: {
        id: "user-1",
        email: "user@example.com",
        displayName: "Marsel",
        role: "user",
        isActive: true,
      },
    });

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer valid-token")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.id).toBe("user-1");
    expect(response.body.data.user.email).toBe("user@example.com");
    expect(response.body.data.user.role).toBe("user");
  });

  it("GET /auth/admin-test returns 403 when user lacks admin role", async () => {
    mockedVerifyAccessToken.mockResolvedValue(buildAuthContext());

    fakePrisma.authIdentity.findUnique.mockResolvedValue({
      id: "identity-1",
      provider: "https://issuer.example.com",
      providerSubject: "provider|user-123",
      providerEmail: "user@example.com",
      emailVerified: true,
      user: {
        id: "user-1",
        email: "user@example.com",
        displayName: null,
        role: "user",
        isActive: true,
      },
    });

    fakePrisma.authIdentity.update.mockResolvedValue({
      id: "identity-1",
      provider: "https://issuer.example.com",
      providerSubject: "provider|user-123",
      providerEmail: "user@example.com",
      emailVerified: true,
      user: {
        id: "user-1",
        email: "user@example.com",
        displayName: null,
        role: "user",
        isActive: true,
      },
    });

    const response = await request(app)
      .get("/auth/admin-test")
      .set("Authorization", "Bearer valid-token")
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("GET /auth/admin-test returns 200 for admin user", async () => {
    mockedVerifyAccessToken.mockResolvedValue(buildAuthContext());

    fakePrisma.authIdentity.findUnique.mockResolvedValue({
      id: "identity-1",
      provider: "https://issuer.example.com",
      providerSubject: "provider|user-123",
      providerEmail: "admin@example.com",
      emailVerified: true,
      user: {
        id: "user-admin-1",
        email: "admin@example.com",
        displayName: "Admin",
        role: "admin",
        isActive: true,
      },
    });

    fakePrisma.authIdentity.update.mockResolvedValue({
      id: "identity-1",
      provider: "https://issuer.example.com",
      providerSubject: "provider|user-123",
      providerEmail: "admin@example.com",
      emailVerified: true,
      user: {
        id: "user-admin-1",
        email: "admin@example.com",
        displayName: "Admin",
        role: "admin",
        isActive: true,
      },
    });

    const response = await request(app)
      .get("/auth/admin-test")
      .set("Authorization", "Bearer valid-token")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.id).toBe("user-admin-1");
    expect(response.body.data.user.role).toBe("admin");
  });
});
