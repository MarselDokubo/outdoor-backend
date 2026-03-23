import type { OwnershipProofReferenceData } from "../../../domain/place/ownership-proof.js";
import type {
  PlaceClaimStatus,
  PlacePublicationStatus,
  PlaceSourceType,
  PlaceVisibility,
} from "../../../domain/place/place.enums.js";
import { Place } from "../../../domain/place/place.js";
import { PlaceClaim } from "../../../domain/place/place-claim.js";

interface PlaceRecord {
  id: string;
  slug: string;
  name: string;
  categoryCode: string;
  shortDescription: string | null;
  fullDescription: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
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
  publicationStatus: PlacePublicationStatus | string;
  visibility: PlaceVisibility | string;
  createdByUserId: string;
  sourceType: PlaceSourceType | string;
  officialTagline: string | null;
  officialSummary: string | null;
  isOwnerManaged: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

interface PlaceClaimRecord {
  id: string;
  placeId: string;
  claimantUserId: string;
  proofReferences: unknown;
  status: PlaceClaimStatus | string;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedByUserId: string | null;
  reviewNotes: string | null;
  updatedAt: Date;
}

export function toPlaceEntity(record: PlaceRecord): Place {
  return Place.rehydrate({
    id: record.id,
    slug: record.slug,
    name: record.name,
    category: record.categoryCode,
    descriptions: {
      shortDescription: record.shortDescription,
      fullDescription: record.fullDescription,
    },
    contactDetails: {
      phone: record.phone,
      email: record.email,
      website: record.website,
    },
    location: {
      latitude: record.latitude,
      longitude: record.longitude,
      addressLine1: record.addressLine1,
      addressLine2: record.addressLine2,
      area: record.area,
      city: record.city,
      state: record.state,
      postalCode: record.postalCode,
      countryCode: record.countryCode,
      formattedAddress: record.formattedAddress,
    },
    publicationStatus: record.publicationStatus as PlacePublicationStatus,
    visibility: record.visibility as PlaceVisibility,
    createdByUserId: record.createdByUserId,
    sourceType: record.sourceType as PlaceSourceType,
    officialTagline: record.officialTagline,
    officialSummary: record.officialSummary,
    isOwnerManaged: record.isOwnerManaged,
    isVerified: record.isVerified,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    archivedAt: record.archivedAt,
  });
}

export function toPlacePersistence(place: Place) {
  const data = place.toPrimitives();
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    categoryCode: data.category,
    shortDescription: data.shortDescription,
    fullDescription: data.fullDescription,
    phone: data.phone,
    email: data.email,
    website: data.website,
    latitude: data.latitude,
    longitude: data.longitude,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2,
    area: data.area,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    countryCode: data.countryCode,
    formattedAddress: data.formattedAddress,
    publicationStatus: data.publicationStatus,
    visibility: data.visibility,
    createdByUserId: data.createdByUserId,
    sourceType: data.sourceType,
    officialTagline: data.officialTagline,
    officialSummary: data.officialSummary,
    isOwnerManaged: data.isOwnerManaged,
    isVerified: data.isVerified,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    archivedAt: data.archivedAt,
  };
}

export function toPlaceClaimEntity(record: PlaceClaimRecord): PlaceClaim {
  return PlaceClaim.rehydrate({
    id: record.id,
    placeId: record.placeId,
    claimantUserId: record.claimantUserId,
    proofReferences: Array.isArray(record.proofReferences)
      ? (record.proofReferences as OwnershipProofReferenceData[])
      : [],
    status: record.status as PlaceClaimStatus,
    submittedAt: record.submittedAt,
    reviewedAt: record.reviewedAt,
    reviewedByUserId: record.reviewedByUserId,
    reviewNotes: record.reviewNotes,
    updatedAt: record.updatedAt,
  });
}

export function toPlaceClaimPersistence(claim: PlaceClaim) {
  const data = claim.toPrimitives();
  return {
    id: data.id,
    placeId: data.placeId,
    claimantUserId: data.claimantUserId,
    proofReferences: data.proofReferences,
    status: data.status,
    submittedAt: data.submittedAt,
    reviewedAt: data.reviewedAt,
    reviewedByUserId: data.reviewedByUserId,
    reviewNotes: data.reviewNotes,
    updatedAt: data.updatedAt,
  };
}
