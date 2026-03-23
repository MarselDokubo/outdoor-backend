import type { Actor } from "../../domain/place/place-actor.js";
import type { OwnershipProofKind, PlaceOwnerRole } from "../../domain/place/place.enums.js";

export interface PlaceLocationInput {
  latitude: number;
  longitude: number;
  addressLine1?: string | null | undefined;
  addressLine2?: string | null | undefined;
  area?: string | null | undefined;
  city?: string | null | undefined;
  state?: string | null | undefined;
  postalCode?: string | null | undefined;
  countryCode: string;
  formattedAddress?: string | null | undefined;
}

export interface PlaceContactInput {
  phone?: string | null | undefined;
  email?: string | null | undefined;
  website?: string | null | undefined;
}

export interface PlaceDescriptionsInput {
  shortDescription?: string | null | undefined;
  fullDescription?: string | null | undefined;
}

export interface OwnershipProofInput {
  kind: OwnershipProofKind;
  fileKey: string;
  originalFilename?: string | null | undefined;
  note?: string | null | undefined;
}

export interface CreatePlaceCommand {
  actor: Actor;
  name: string;
  category: string;
  location: PlaceLocationInput;
  visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE" | undefined;
  descriptions?: PlaceDescriptionsInput | undefined;
  contactDetails?: PlaceContactInput | undefined;
  officialTagline?: string | null | undefined;
  officialSummary?: string | null | undefined;
  submitClaim?: boolean | undefined;
  proofReferences?: OwnershipProofInput[] | undefined;
  publishNow?: boolean | undefined;
}

export interface UpdatePlaceCommand {
  actor: Actor;
  placeId: string;
  name?: string | undefined;
  category?: string | undefined;
  visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE" | undefined;
  descriptions?: PlaceDescriptionsInput | undefined;
  contactDetails?: PlaceContactInput | undefined;
  location?: PlaceLocationInput | undefined;
}

export interface PublishPlaceCommand {
  actor: Actor;
  placeId: string;
}

export interface ArchivePlaceCommand {
  actor: Actor;
  placeId: string;
}

export interface UpdateOfficialPlaceProfileCommand {
  actor: Actor;
  placeId: string;
  officialTagline?: string | null | undefined;
  officialSummary?: string | null | undefined;
  descriptions?: PlaceDescriptionsInput | undefined;
  contactDetails?: PlaceContactInput | undefined;
}

export interface SubmitPlaceClaimCommand {
  actor: Actor;
  placeId: string;
  proofReferences: OwnershipProofInput[];
}

export interface ReviewPlaceClaimCommand {
  actor: Actor;
  claimId: string;
  decision: "APPROVE" | "REJECT";
  reviewNotes?: string | null | undefined;
  roleOnApproval?: PlaceOwnerRole | undefined;
}

export interface PlaceMutationResult {
  placeId: string;
  slug: string;
  publicationStatus: string;
  visibility: string;
}

export interface PlaceMarkerView {
  id: string;
  slug: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distanceMeters?: number | undefined;
  visibility: string;
  isVerified: boolean;
}

export interface PlaceDetailsView {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string | null;
  fullDescription: string | null;
  officialTagline: string | null;
  officialSummary: string | null;
  contactDetails: {
    phone: string | null;
    email: string | null;
    website: string | null;
  };
  location: {
    latitude: number;
    longitude: number;
    addressLine1: string | null;
    addressLine2: string | null;
    area: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    countryCode: string;
    formattedAddress: string | null;
  };
  publicationStatus: string;
  visibility: string;
  isOwnerManaged: boolean;
  isVerified: boolean;
  canCurrentViewerManage: boolean;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchPlacesQuery {
  actor?: Actor | null | undefined;
  q?: string | undefined;
  category?: string | undefined;
  limit?: number | undefined;
  cursor?: string | undefined;
}

export interface NearbyPlacesQuery {
  actor?: Actor | null | undefined;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  category?: string | undefined;
  limit?: number | undefined;
}

export interface TaggingPlacesQuery {
  actor?: Actor | null | undefined;
  q: string;
  limit?: number | undefined;
}

export interface ListMyOwnedPlacesQuery {
  actor: Actor;
}

export interface ListPendingClaimsQuery {
  actor: Actor;
}

export interface SearchPlacesResult {
  items: PlaceMarkerView[];
  nextCursor: string | null;
}

export interface PendingPlaceClaimView {
  id: string;
  placeId: string;
  placeName: string;
  claimantUserId: string;
  status: string;
  submittedAt: string;
  proofReferences: OwnershipProofInput[];
}
