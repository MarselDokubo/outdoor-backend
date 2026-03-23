import type { Actor } from "./place-actor.js";
import { isStaffActor } from "./place-actor.js";
import type { PlaceOwnerMembership } from "./place-owner-membership.js";
import type { PlacePublicationStatus, PlaceVisibility } from "./place.enums.js";

export function canManagePlace(actor: Actor, membership: PlaceOwnerMembership | null): boolean {
  return isStaffActor(actor) || membership?.status === "ACTIVE";
}

export function canReviewClaims(actor: Actor): boolean {
  return isStaffActor(actor);
}

export function canViewPlaceDetail(input: {
  actor?: Actor | null;
  publicationStatus: PlacePublicationStatus;
  visibility: PlaceVisibility;
  membership?: PlaceOwnerMembership | null;
}): boolean {
  const { actor, publicationStatus, visibility, membership } = input;

  if (isStaffActor(actor)) return true;
  if (membership?.status === "ACTIVE") return true;

  if (publicationStatus !== "PUBLISHED") {
    return false;
  }

  if (visibility === "PUBLIC") return true;
  if (visibility === "UNLISTED") return true;
  return false;
}

export function canAppearInDiscovery(input: {
  actor?: Actor | null;
  publicationStatus: PlacePublicationStatus;
  visibility: PlaceVisibility;
  membership?: PlaceOwnerMembership | null;
}): boolean {
  const { actor, publicationStatus, visibility, membership } = input;
  if (isStaffActor(actor)) return true;
  if (membership?.status === "ACTIVE") return true;
  return publicationStatus === "PUBLISHED" && visibility === "PUBLIC";
}
