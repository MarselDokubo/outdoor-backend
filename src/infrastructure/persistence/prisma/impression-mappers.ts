import type { Impression } from "../../../domain/engagement/impression.js";
import { Impression as ImpressionEntity } from "../../../domain/engagement/impression.js";

interface ImpressionRecord {
  id: string;
  targetType: "PLACE" | "POST" | "EVENT";
  targetId: string;
  viewerUserId: string | null;
  sessionKey: string | null;
  createdAt: Date;
}

export function toImpressionEntity(record: ImpressionRecord): Impression {
  return ImpressionEntity.rehydrate({
    id: record.id,
    targetType: record.targetType,
    targetId: record.targetId,
    viewerUserId: record.viewerUserId,
    sessionKey: record.sessionKey,
    createdAt: record.createdAt,
  });
}

export function toImpressionPersistence(impression: Impression): ImpressionRecord {
  const data = impression.toObject();

  return {
    id: data.id,
    targetType: data.targetType,
    targetId: data.targetId,
    viewerUserId: data.viewerUserId,
    sessionKey: data.sessionKey,
    createdAt: data.createdAt,
  };
}
