import { z } from "zod";

const postVisibilitySchema = z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]);

export const placeIdParamSchema = z.object({
  placeId: z.string().min(1),
});

export const postIdParamSchema = z.object({
  postId: z.string().min(1),
});

export const createPostBodySchema = z.object({
  placeId: z.string().min(1),
  body: z.string().min(1).max(2200),
  visibility: postVisibilitySchema.default("PUBLIC"),
});

export const updatePostBodySchema = z.object({
  body: z.string().min(1).max(2200),
  visibility: postVisibilitySchema,
});

export const listPlacePostsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().min(1).optional(),
});

export const listMyPostsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().min(1).optional(),
});
