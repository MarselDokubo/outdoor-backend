export const PLACE_CATEGORY_CODES = [
  "RESTAURANT",
  "CAFE",
  "LOUNGE",
  "HOTEL",
  "RESORT",
  "PARK",
  "BEACH",
  "LANDMARK",
  "MUSEUM",
  "GALLERY",
  "MALL",
  "MARKET",
  "NIGHTLIFE",
  "FITNESS",
  "WORSHIP",
  "HOSPITAL",
  "PHARMACY",
  "SCHOOL",
  "CO_WORKING",
  "EVENT_VENUE",
  "RECREATION",
  "SPORTS",
  "OTHER",
] as const;

export type PlaceCategoryCode = (typeof PLACE_CATEGORY_CODES)[number];

export const PLACE_VISIBILITIES = ["PUBLIC", "UNLISTED", "PRIVATE"] as const;
export type PlaceVisibility = (typeof PLACE_VISIBILITIES)[number];

export const PLACE_PUBLICATION_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type PlacePublicationStatus = (typeof PLACE_PUBLICATION_STATUSES)[number];

export const PLACE_SOURCE_TYPES = ["USER_SUBMITTED", "CURATED", "IMPORTED"] as const;
export type PlaceSourceType = (typeof PLACE_SOURCE_TYPES)[number];

export const PLACE_CLAIM_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "WITHDRAWN",
] as const;
export type PlaceClaimStatus = (typeof PLACE_CLAIM_STATUSES)[number];

export const PLACE_OWNER_ROLES = ["OWNER", "MANAGER"] as const;
export type PlaceOwnerRole = (typeof PLACE_OWNER_ROLES)[number];

export const PLACE_OWNER_MEMBERSHIP_STATUSES = ["ACTIVE", "REVOKED"] as const;
export type PlaceOwnerMembershipStatus = (typeof PLACE_OWNER_MEMBERSHIP_STATUSES)[number];

export const OWNERSHIP_PROOF_KINDS = [
  "BUSINESS_REGISTRATION",
  "UTILITY_BILL",
  "LEASE",
  "GOVERNMENT_ID",
  "OFFICIAL_EMAIL_DOMAIN",
  "OTHER",
] as const;
export type OwnershipProofKind = (typeof OWNERSHIP_PROOF_KINDS)[number];
