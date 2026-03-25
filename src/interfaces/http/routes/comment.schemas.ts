import { z } from "zod";

const targetTypeSchema = z.enum(["PLACE", "POST", "EVENT"]);

export const commentIdParamSchema = z.object({
  commentId: z.string().min(1),
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

export const createCommentBodySchema = z.object({
  targetType: targetTypeSchema,
  targetId: z.string().min(1),
  body: z.string().min(1).max(2000),
});

export const updateCommentBodySchema = z.object({
  body: z.string().min(1).max(2000),
});
