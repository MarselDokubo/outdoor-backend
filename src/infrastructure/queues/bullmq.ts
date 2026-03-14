import { env } from "../../config/env";

function getRedisHostPortFromUrl(url: string): { host: string; port: number } {
  const parsed = new URL(url);

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
  };
}

export function createBullMqQueueConnection() {
  const { host, port } = getRedisHostPortFromUrl(env.REDIS_URL);

  return {
    host,
    port,
    maxRetriesPerRequest: 1,
  } as const;
}

export function createBullMqWorkerConnection() {
  const { host, port } = getRedisHostPortFromUrl(env.REDIS_URL);

  return {
    host,
    port,
    maxRetriesPerRequest: null,
  } as const;
}
