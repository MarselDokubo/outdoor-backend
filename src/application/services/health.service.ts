import { performance } from "node:perf_hooks";
import type { PrismaClient } from "../../generated/prisma/client";
import type { RedisClientType } from "redis";
import type { Logger } from "pino";
import { logger } from "../../infrastructure/logging/logger";

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

	live(log?: Logger): LiveResponse {
		const scopedLogger = this.getLogger(log);

		const result: LiveResponse = {
			status: "ok",
			service: "outdoor-backend",
			timestamp: new Date().toISOString(),
			uptimeSeconds: Math.floor(process.uptime()),
		};

		scopedLogger.debug(
			{
				uptimeSeconds: result.uptimeSeconds,
			},
			"liveness check completed",
		);

		return result;
	}

	async ready(log?: Logger): Promise<ReadyResponse> {
		const scopedLogger = this.getLogger(log);

		scopedLogger.info("readiness check started");

		const [postgres, redis] = await Promise.all([
			this.checkPostgres(scopedLogger),
			this.checkRedis(scopedLogger),
		]);

		const status =
			postgres.status === "up" && redis.status === "up" ? "ok" : "degraded";

		const result: ReadyResponse = {
			status,
			service: "outdoor-backend",
			timestamp: new Date().toISOString(),
			uptimeSeconds: Math.floor(process.uptime()),
			checks: {
				postgres,
				redis,
			},
		};

		scopedLogger.info(
			{
				status: result.status,
				checks: result.checks,
			},
			"readiness check completed",
		);

		return result;
	}

	async deps(log?: Logger): Promise<ReadyResponse> {
		const scopedLogger = this.getLogger(log);
		scopedLogger.debug("dependency check requested");
		return this.ready(scopedLogger);
	}

	private async checkPostgres(log: Logger): Promise<DependencyCheck> {
		const started = performance.now();

		try {
			await this.prisma.$queryRawUnsafe("SELECT 1");

			const result = {
				status: "up" as const,
				latencyMs: Math.round(performance.now() - started),
			};

			log.debug(
				{
					dependency: "postgres",
					latencyMs: result.latencyMs,
					status: result.status,
				},
				"dependency check passed",
			);

			return result;
		} catch (error) {
			const result = {
				status: "down" as const,
				latencyMs: Math.round(performance.now() - started),
				error: error instanceof Error ? error.message : "Unknown Postgres error",
			};

			log.warn(
				{
					dependency: "postgres",
					latencyMs: result.latencyMs,
					status: result.status,
					error: result.error,
				},
				"dependency check failed",
			);

			return result;
		}
	}

	private async checkRedis(log: Logger): Promise<DependencyCheck> {
		const started = performance.now();

		try {
			await this.redis.ping();

			const result = {
				status: "up" as const,
				latencyMs: Math.round(performance.now() - started),
			};

			log.debug(
				{
					dependency: "redis",
					latencyMs: result.latencyMs,
					status: result.status,
				},
				"dependency check passed",
			);

			return result;
		} catch (error) {
			const result = {
				status: "down" as const,
				latencyMs: Math.round(performance.now() - started),
				error: error instanceof Error ? error.message : "Unknown Redis error",
			};

			log.warn(
				{
					dependency: "redis",
					latencyMs: result.latencyMs,
					status: result.status,
					error: result.error,
				},
				"dependency check failed",
			);

			return result;
		}
	}

	private getLogger(log?: Logger): Logger {
		return log ?? logger.child({ component: "HealthService" });
	}
}
