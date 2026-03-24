import type { Event as PrismaEvent } from "../../../generated/prisma/client.js";
import { Event } from "../../../domain/event/event.js";

export function toEventEntity(record: PrismaEvent): Event {
  return Event.rehydrate({
    id: record.id,
    hostUserId: record.hostUserId,
    placeId: record.placeId,
    title: record.title,
    summary: record.summary,
    description: record.description,
    startsAt: record.startsAt,
    endsAt: record.endsAt,
    visibility: record.visibility,
    status: record.status,
    publishedAt: record.publishedAt,
    cancelledAt: record.cancelledAt,
    archivedAt: record.archivedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}

export function toEventPersistence(event: Event) {
  const data = event.toObject();
  return {
    id: data.id,
    hostUserId: data.hostUserId,
    placeId: data.placeId,
    title: data.title,
    summary: data.summary,
    description: data.description,
    startsAt: data.startsAt,
    endsAt: data.endsAt,
    visibility: data.visibility,
    status: data.status,
    publishedAt: data.publishedAt,
    cancelledAt: data.cancelledAt,
    archivedAt: data.archivedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
