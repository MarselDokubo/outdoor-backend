export const USER_STATUSES = ["active", "suspended", "deactivated"] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export function isUserStatus(value: string): value is UserStatus {
  return USER_STATUSES.includes(value as UserStatus);
}
