import { z } from "zod";

const targetTypeSchema = z.enum(["PLACE", "POST", "EVENT"]);
const reactionTypeSchema = z.enum(["LIKE", "INTERESTED", "FIRE"]);

export const reactToTargetBodySchema = z.object({
  targetType: targetTypeSchema,
  targetId: z.string().min(1),
  reactionType: reactionTypeSchema,
});

export const removeReactionBodySchema = z.object({
  targetType: targetTypeSchema,
  targetId: z.string().min(1),
});

export const saveTargetBodySchema = z.object({
  targetType: targetTypeSchema,
  targetId: z.string().min(1),
});

export const removeSaveBodySchema = z.object({
  targetType: targetTypeSchema,
  targetId: z.string().min(1),
});

export const placeIdParamSchema = z.object({
  placeId: z.string().min(1),
});

export const postIdParamSchema = z.object({
  postId: z.string().min(1),
});

export const eventIdParamSchema = z.object({
  eventId: z.string().min(1),
});

export const listMySavedQuerySchema = z.object({
  targetType: targetTypeSchema.optional(),
});
