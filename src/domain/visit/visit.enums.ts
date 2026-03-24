export const VISIT_STATUSES = ["ACTIVE", "COMPLETED", "CANCELLED"] as const;
export type VisitStatus = (typeof VISIT_STATUSES)[number];

export const VISIT_SOURCE_TYPES = ["MANUAL_CHECK_IN", "SYSTEM_DETECTED"] as const;
export type VisitSourceType = (typeof VISIT_SOURCE_TYPES)[number];

export const VISIT_SOURCE_LABELS: Record<VisitSourceType, string> = {
  MANUAL_CHECK_IN: "Manual check-in",
  SYSTEM_DETECTED: "System detected",
};
