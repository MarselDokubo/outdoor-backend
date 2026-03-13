import { describe, expect, it, vi, beforeEach } from "vitest";
import { HealthService } from "../src/application/services/health.service";

describe("HealthService", () => {
  let fakePrisma: {
    $queryRawUnsafe: ReturnType<typeof vi.fn>;
  };

  let fakeRedis: {
    ping: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    fakePrisma = {
      $queryRawUnsafe: vi.fn(),
    };

    fakeRedis = {
      ping: vi.fn(),
    };
  });

  it("live() returns liveness payload", () => {
    const service = new HealthService(fakePrisma as any, fakeRedis as any);

    const result = service.live();

    expect(result.status).toBe("ok");
    expect(result.service).toBe("outdoor-backend");
    expect(typeof result.timestamp).toBe("string");
    expect(typeof result.uptimeSeconds).toBe("number");
  });

  it("ready() returns ok when postgres and redis are up", async () => {
    fakePrisma.$queryRawUnsafe.mockResolvedValue(1);
    fakeRedis.ping.mockResolvedValue("PONG");

    const service = new HealthService(fakePrisma as any, fakeRedis as any);

    const result = await service.ready();

    expect(result.status).toBe("ok");
    expect(result.checks.postgres.status).toBe("up");
    expect(result.checks.redis.status).toBe("up");
    expect(result.checks.postgres.latencyMs).toBeGreaterThanOrEqual(0);
    expect(result.checks.redis.latencyMs).toBeGreaterThanOrEqual(0);

    expect(fakePrisma.$queryRawUnsafe).toHaveBeenCalledWith("SELECT 1");
    expect(fakeRedis.ping).toHaveBeenCalled();
  });

  it("ready() returns degraded when postgres is down", async () => {
    fakePrisma.$queryRawUnsafe.mockRejectedValue(new Error("Postgres unavailable"));
    fakeRedis.ping.mockResolvedValue("PONG");

    const service = new HealthService(fakePrisma as any, fakeRedis as any);

    const result = await service.ready();

    expect(result.status).toBe("degraded");
    expect(result.checks.postgres.status).toBe("down");
    expect(result.checks.redis.status).toBe("up");
    expect(result.checks.postgres.error).toContain("Postgres unavailable");
  });

  it("ready() returns degraded when redis is down", async () => {
    fakePrisma.$queryRawUnsafe.mockResolvedValue(1);
    fakeRedis.ping.mockRejectedValue(new Error("Redis unavailable"));

    const service = new HealthService(fakePrisma as any, fakeRedis as any);

    const result = await service.ready();

    expect(result.status).toBe("degraded");
    expect(result.checks.postgres.status).toBe("up");
    expect(result.checks.redis.status).toBe("down");
    expect(result.checks.redis.error).toContain("Redis unavailable");
  });

  it("deps() returns the same dependency structure as ready()", async () => {
    fakePrisma.$queryRawUnsafe.mockResolvedValue(1);
    fakeRedis.ping.mockResolvedValue("PONG");

    const service = new HealthService(fakePrisma as any, fakeRedis as any);

    const result = await service.deps();

    expect(result.status).toBe("ok");
    expect(result.checks.postgres.status).toBe("up");
    expect(result.checks.redis.status).toBe("up");
  });
});
