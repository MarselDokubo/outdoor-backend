import { z } from "zod";

export const placeMediaParamsSchema = z.object({
  placeId: z.string().min(1),
});

export const mediaAssetParamsSchema = z.object({
  mediaAssetId: z.string().min(1),
});

export const placeMediaDeleteParamsSchema = z.object({
  placeId: z.string().min(1),
  mediaAssetId: z.string().min(1),
});

export const attachPlaceMediaBodySchema = z.object({
  role: z.enum(["PRIMARY", "GALLERY", "CONTENT"]).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
});
