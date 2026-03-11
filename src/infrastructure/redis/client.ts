import { createClient, type RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

export const redisClient: RedisClientType = createClient({
	url: redisUrl,
});

redisClient.on("error", (error) => {
	console.error("[redis] client error:", error);
});

redisClient.on("connect", () => {
	console.log("[redis] connecting...");
});

redisClient.on("ready", () => {
	console.log("[redis] ready");
});

redisClient.on("end", () => {
	console.log("[redis] connection closed");
});

export async function connectRedis(): Promise<void> {
	if (!redisClient.isOpen) {
		await redisClient.connect();
	}
}

export async function disconnectRedis(): Promise<void> {
	if (redisClient.isOpen) {
		await redisClient.quit();
	}
}
