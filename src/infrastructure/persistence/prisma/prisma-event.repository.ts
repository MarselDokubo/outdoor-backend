import type { EventRepository } from "../../../domain/event/repositories/index.js";
import type { Event } from "../../../domain/event/event.js";
import type { EventPrismaClient, EventPrismaTransactionClient } from "./event-prisma.types.js";
import { toEventEntity, toEventPersistence } from "./event-mappers.js";

type PrismaDb = EventPrismaClient | EventPrismaTransactionClient;

export class PrismaEventRepository implements EventRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findById(eventId: string): Promise<Event | null> {
    const record = await this.db.event.findUnique({ where: { id: eventId } });
    return record ? toEventEntity(record) : null;
  }

  public async save(event: Event): Promise<void> {
    const data = toEventPersistence(event);
    await this.db.event.upsert({
      where: { id: data.id },
      update: {
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
        updatedAt: data.updatedAt,
      },
      create: data,
    });
  }
}
