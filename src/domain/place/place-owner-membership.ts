import type { PlaceOwnerMembershipStatus, PlaceOwnerRole } from "./place.enums.js";

export interface PlaceOwnerMembership {
  id: string;
  placeId: string;
  userId: string;
  role: PlaceOwnerRole;
  status: PlaceOwnerMembershipStatus;
  grantedAt: Date;
  grantedByUserId: string;
}
