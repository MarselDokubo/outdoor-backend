import { Visit } from "../../../domain/visit/visit.js";
import type { VisitSourceType, VisitStatus } from "../../../domain/visit/visit.enums.js";

interface VisitRecord {
  id: string;
  userId: string;
  placeId: string;
  status: VisitStatus | string;
  sourceType: VisitSourceType | string;
  startedAt: Date;
  endedAt: Date | null;
  confidenceScore: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toVisitEntity(record: VisitRecord): Visit {
  return Visit.rehydrate({
    id: record.id,
    userId: record.userId,
    placeId: record.placeId,
    status: record.status as VisitStatus,
    sourceType: record.sourceType as VisitSourceType,
    startedAt: record.startedAt,
    endedAt: record.endedAt,
    confidenceScore: record.confidenceScore,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}

export function toVisitPersistence(visit: Visit) {
  return visit.toPrimitives();
}
