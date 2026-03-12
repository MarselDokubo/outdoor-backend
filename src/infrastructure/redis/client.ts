import { createClient, type RedisClientType } from "redis";
import { logger } from "../logging/logger";

const redisLogger = logger.child({ component: "redis" });
const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

export const redisClient: RedisClientType = createClient({
	url: redisUrl,
});

redisClient.on("error", (error) => {
	redisLogger.error({ err: error }, "redis client error");
});

redisClient.on("connect", () => {
	redisLogger.info("redis connecting");
});

redisClient.on("ready", () => {
	redisLogger.info("redis ready");
});

redisClient.on("reconnecting", () => {
	redisLogger.warn("redis reconnecting");
});

redisClient.on("end", () => {
	redisLogger.info("redis connection closed");
});

export async function connectRedis(): Promise<void> {
	if (!redisClient.isOpen) {
		redisLogger.debug({ url: redisUrl }, "opening redis connection");
		await redisClient.connect();
	} else {
		redisLogger.debug("redis connection already open");
	}
}

export async function disconnectRedis(): Promise<void> {
	if (redisClient.isOpen) {
		redisLogger.debug("closing redis connection");
		await redisClient.quit();
	} else {
		redisLogger.debug("redis connection already closed");
	}
}
