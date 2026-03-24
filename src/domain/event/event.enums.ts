export const EVENT_VISIBILITY = ["PUBLIC", "UNLISTED", "PRIVATE"] as const;
export type EventVisibility = (typeof EVENT_VISIBILITY)[number];

export const EVENT_STATUS = ["DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED"] as const;
export type EventStatus = (typeof EVENT_STATUS)[number];
