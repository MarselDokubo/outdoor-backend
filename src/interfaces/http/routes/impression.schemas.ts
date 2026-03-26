import { z } from "zod";

const targetTypeSchema = z.enum(["PLACE", "POST", "EVENT"]);
const nullableSessionKeySchema = z.string().trim().min(8).max(120).nullable().optional();

export const recordImpressionBodySchema = z.object({
  targetType: targetTypeSchema,
  targetId: z.string().trim().min(1).max(50),
  sessionKey: nullableSessionKeySchema,
});

export const getImpressionSummaryQuerySchema = z.object({
  targetType: targetTypeSchema,
  targetId: z.string().trim().min(1).max(50),
  sessionKey: nullableSessionKeySchema,
});
