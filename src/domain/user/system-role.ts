export const SYSTEM_ROLES = ["user", "creator", "moderator", "admin", "super_admin"] as const;

export type SystemRole = (typeof SYSTEM_ROLES)[number];

export function isSystemRole(value: string): value is SystemRole {
  return SYSTEM_ROLES.includes(value as SystemRole);
}
