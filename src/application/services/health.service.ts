import { performance } from "node:perf_hooks";
import type { RedisClientType } from "redis";
import { PrismaClient } from "../../../src/generated/prisma/client"
type DependencyStatus = "up" | "down";

type DependencyCheck = {
	status: DependencyStatus;
	latencyMs: number;
	error?: string;
};

type HealthChecks = {
	postgres: DependencyCheck;
	redis: DependencyCheck;
};

export type LiveResponse = {
	status: "ok";
	service: string;
	timestamp: string;
	uptimeSeconds: number;
};

export type ReadyResponse = {
	status: "ok" | "degraded";
	service: string;
	timestamp: string;
	uptimeSeconds: number;
	checks: HealthChecks;
};

export class HealthService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly redis: RedisClientType,
	) { }

	live(): LiveResponse {
		return {
			status: "ok",
			service: "outdoor-backend",
			timestamp: new Date().toISOString(),
			uptimeSeconds: Math.floor(process.uptime()),
		};
	}

	async ready(): Promise<ReadyResponse> {
		const [postgres, redis] = await Promise.all([
			this.checkPostgres(),
			this.checkRedis(),
		]);

		const status =
			postgres.status === "up" && redis.status === "up" ? "ok" : "degraded";

		return {
			status,
			service: "outdoor-backend",
			timestamp: new Date().toISOString(),
			uptimeSeconds: Math.floor(process.uptime()),
			checks: {
				postgres,
				redis,
			},
		};
	}

	async deps(): Promise<ReadyResponse> {
		return this.ready();
	}

	private async checkPostgres(): Promise<DependencyCheck> {
		const started = performance.now();

		try {
			await this.prisma.$queryRawUnsafe("SELECT 1");
			return {
				status: "up",
				latencyMs: Math.round(performance.now() - started),
			};
		} catch (error) {
			return {
				status: "down",
				latencyMs: Math.round(performance.now() - started),
				error: error instanceof Error ? error.message : "Unknown Postgres error",
			};
		}
	}

	private async checkRedis(): Promise<DependencyCheck> {
		const started = performance.now();

		try {
			await this.redis.ping();
			return {
				status: "up",
				latencyMs: Math.round(performance.now() - started),
			};
		} catch (error) {
			return {
				status: "down",
				latencyMs: Math.round(performance.now() - started),
				error: error instanceof Error ? error.message : "Unknown Redis error",
			};
		}
	}
}
