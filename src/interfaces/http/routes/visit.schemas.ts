import { z } from "zod";

export const placeIdParamSchema = z.object({
  placeId: z.string().min(1),
});

export const visitIdParamSchema = z.object({
  visitId: z.string().min(1),
});
