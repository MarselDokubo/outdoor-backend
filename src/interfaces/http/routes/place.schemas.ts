import { z } from "zod";
import {
  OWNERSHIP_PROOF_KINDS,
  PLACE_CATEGORY_CODES,
  PLACE_OWNER_ROLES,
  PLACE_VISIBILITIES,
} from "../../../domain/place/place.enums.js";

const _nullableTrimmedString = z.string().trim().min(1).max(5000).nullable().optional();

export const placeLocationSchema = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  addressLine1: z.string().trim().min(1).max(200).nullable().optional(),
  addressLine2: z.string().trim().min(1).max(200).nullable().optional(),
  area: z.string().trim().min(1).max(120).nullable().optional(),
  city: z.string().trim().min(1).max(120).nullable().optional(),
  state: z.string().trim().min(1).max(120).nullable().optional(),
  postalCode: z.string().trim().min(1).max(40).nullable().optional(),
  countryCode: z.string().trim().length(2),
  formattedAddress: z.string().trim().min(1).max(255).nullable().optional(),
});

export const placeContactSchema = z.object({
  phone: z.string().trim().min(1).max(40).nullable().optional(),
  email: z.string().trim().email().nullable().optional(),
  website: z.string().trim().url().nullable().optional(),
});

export const placeDescriptionsSchema = z.object({
  shortDescription: z.string().trim().min(1).max(280).nullable().optional(),
  fullDescription: z.string().trim().min(1).max(5000).nullable().optional(),
});

export const ownershipProofSchema = z.object({
  kind: z.enum(OWNERSHIP_PROOF_KINDS),
  fileKey: z.string().trim().min(1).max(500),
  originalFilename: z.string().trim().min(1).max(255).nullable().optional(),
  note: z.string().trim().min(1).max(500).nullable().optional(),
});

export const createPlaceBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.enum(PLACE_CATEGORY_CODES),
  location: placeLocationSchema,
  visibility: z.enum(PLACE_VISIBILITIES).optional(),
  descriptions: placeDescriptionsSchema.optional(),
  contactDetails: placeContactSchema.optional(),
  officialTagline: z.string().trim().min(1).max(140).nullable().optional(),
  officialSummary: z.string().trim().min(1).max(1000).nullable().optional(),
  submitClaim: z.boolean().optional(),
  proofReferences: z.array(ownershipProofSchema).optional(),
  publishNow: z.boolean().optional(),
});

export const updatePlaceBodySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  category: z.enum(PLACE_CATEGORY_CODES).optional(),
  visibility: z.enum(PLACE_VISIBILITIES).optional(),
  descriptions: placeDescriptionsSchema.optional(),
  contactDetails: placeContactSchema.optional(),
  location: placeLocationSchema.optional(),
});

export const updateOfficialProfileBodySchema = z.object({
  officialTagline: z.string().trim().min(1).max(140).nullable().optional(),
  officialSummary: z.string().trim().min(1).max(1000).nullable().optional(),
  descriptions: placeDescriptionsSchema.optional(),
  contactDetails: placeContactSchema.optional(),
});

export const searchPlacesQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  category: z.enum(PLACE_CATEGORY_CODES).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  cursor: z.string().trim().min(1).optional(),
});

export const nearbyPlacesQuerySchema = z.object({
  latitude: z.coerce.number().gte(-90).lte(90),
  longitude: z.coerce.number().gte(-180).lte(180),
  radiusMeters: z.coerce.number().int().min(50).max(50000),
  category: z.enum(PLACE_CATEGORY_CODES).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const taggingPlacesQuerySchema = z.object({
  q: z.string().trim().min(1).max(120),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const placeIdParamSchema = z.object({
  placeId: z.string().trim().min(1),
});

export const claimIdParamSchema = z.object({
  claimId: z.string().trim().min(1),
});

export const slugParamSchema = z.object({
  slug: z.string().trim().min(1),
});

export const submitClaimBodySchema = z.object({
  proofReferences: z.array(ownershipProofSchema).min(1),
});

export const reviewClaimBodySchema = z.object({
  decision: z.enum(["APPROVE", "REJECT"]),
  reviewNotes: z.string().trim().min(1).max(1000).nullable().optional(),
  roleOnApproval: z.enum(PLACE_OWNER_ROLES).optional(),
});
