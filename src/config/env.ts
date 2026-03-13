import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : undefined;
}

function getNumberEnv(name: string, fallback?: number): number {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`${name} is not set`);
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`${name} must be a valid number`);
  }

  return parsed;
}

export const env = {
  NODE_ENV: getOptionalEnv("NODE_ENV") ?? "development",
  PORT: getNumberEnv("PORT", 3000),

  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  HOST: getOptionalEnv("HOST") ?? "0.0.0.0",
  REDIS_URL: getRequiredEnv("REDIS_URL"),

  LOG_LEVEL: getOptionalEnv("LOG_LEVEL") ?? "info",

  OIDC_ISSUER: getOptionalEnv("OIDC_ISSUER"),
  OIDC_AUDIENCE: getOptionalEnv("OIDC_AUDIENCE"),
} as const;
