import { z } from "zod";

const followTargetTypeSchema = z.enum(["USER", "PLACE"]);

export const followBodySchema = z.object({
  targetType: followTargetTypeSchema,
  targetId: z.string().min(1),
});

export const listMyFollowsQuerySchema = z.object({
  targetType: followTargetTypeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  cursor: z.string().min(1).optional(),
});

export const userIdParamSchema = z.object({
  userId: z.string().min(1),
});

export const placeIdParamSchema = z.object({
  placeId: z.string().min(1),
});
