import { z } from "zod";

export const hotspotWindowSchema = z.enum(["LIVE_3H", "DAY_1"]);

export const hotspotNearbyQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radiusMeters: z.coerce.number().int().positive().max(100_000),
  limit: z.coerce.number().int().positive().max(100).optional(),
  window: hotspotWindowSchema.optional(),
});

export const hotspotPlaceParamSchema = z.object({
  placeId: z.string().min(1),
});

export const hotspotPlaceQuerySchema = z.object({
  window: hotspotWindowSchema.optional(),
});
