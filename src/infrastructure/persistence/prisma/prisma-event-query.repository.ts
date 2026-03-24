import type { Event as PrismaEvent } from "../../../generated/prisma/client.js";
import type { EventQueryService } from "../../../application/event/use-cases/query-services.js";
import type { EventView } from "../../../application/event/contracts.js";
import type { EventPrismaClient } from "./event-prisma.types.js";

export class PrismaEventQueryService implements EventQueryService {
  constructor(private readonly prisma: EventPrismaClient) {}

  public async getById(eventId: string): Promise<EventView | null> {
    const record = await this.prisma.event.findUnique({ where: { id: eventId } });
    return record ? toView(record) : null;
  }

  public async listByPlace(placeId: string): Promise<EventView[]> {
    const records = await this.prisma.event.findMany({
      where: { placeId },
      orderBy: [{ startsAt: "asc" }, { createdAt: "desc" }],
    });

    return records.map(toView);
  }

  public async listByHost(hostUserId: string): Promise<EventView[]> {
    const records = await this.prisma.event.findMany({
      where: { hostUserId },
      orderBy: [{ startsAt: "asc" }, { createdAt: "desc" }],
    });

    return records.map(toView);
  }
}

function toView(record: PrismaEvent): EventView {
  return {
    id: record.id,
    hostUserId: record.hostUserId,
    placeId: record.placeId,
    title: record.title,
    summary: record.summary,
    description: record.description,
    startsAt: record.startsAt.toISOString(),
    endsAt: record.endsAt.toISOString(),
    visibility: record.visibility,
    status: record.status,
    publishedAt: record.publishedAt ? record.publishedAt.toISOString() : null,
    cancelledAt: record.cancelledAt ? record.cancelledAt.toISOString() : null,
    archivedAt: record.archivedAt ? record.archivedAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
