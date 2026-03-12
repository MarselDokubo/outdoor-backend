import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";

describe("GET /health/ready", () => {
	it("returns 200 when postgres and redis are both healthy", async () => {
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

		const response = await request(app)
			.get("/health/ready")
			.expect(200);

		expect(response.body.status).toBe("ok");
		expect(response.body.checks.postgres.status).toBe("up");
		expect(response.body.checks.redis.status).toBe("up");
		expect(fakePrisma.$queryRawUnsafe).toHaveBeenCalledWith("SELECT 1");
		expect(fakeRedis.ping).toHaveBeenCalled();
	});

	it("returns 503 when a dependency is down", async () => {
		const fakePrisma = {
			$queryRawUnsafe: vi.fn().mockResolvedValue(1),
		} as any;

		const fakeRedis = {
			ping: vi.fn().mockRejectedValue(new Error("Redis unavailable")),
		} as any;

		const app = createApp({
			prisma: fakePrisma,
			redis: fakeRedis,
		});

		const response = await request(app)
			.get("/health/ready")
			.expect(503);

		expect(response.body.status).toBe("degraded");
		expect(response.body.checks.postgres.status).toBe("up");
		expect(response.body.checks.redis.status).toBe("down");
		expect(response.body.checks.redis.error).toContain("Redis unavailable");
	});
});
