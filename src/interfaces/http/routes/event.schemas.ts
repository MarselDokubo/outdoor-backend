import { z } from "zod";

const nullableString = z.string().trim().min(1).max(5000).nullable().optional();

export const createEventBodySchema = z.object({
  placeId: z.string().trim().min(1).max(64).nullable().optional(),
  title: z.string().trim().min(3).max(140),
  summary: nullableString,
  description: nullableString,
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).optional(),
});

export const updateEventBodySchema = z.object({
  placeId: z.string().trim().min(1).max(64).nullable().optional(),
  title: z.string().trim().min(3).max(140).nullable().optional(),
  summary: nullableString,
  description: nullableString,
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).optional(),
});

export const eventIdParamSchema = z.object({
  eventId: z.string().trim().min(1).max(64),
});

export const placeIdParamSchema = z.object({
  placeId: z.string().trim().min(1).max(64),
});
