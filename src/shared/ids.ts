import crypto from "node:crypto";

export function newId(prefix?: string): string {
  const value = crypto.randomUUID();
  return prefix ? `${prefix}_${value}` : value;
}
