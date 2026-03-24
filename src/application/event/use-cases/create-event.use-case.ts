import { newId } from "../../../shared/ids.js";
import { Event } from "../../../domain/event/event.js";
import type { EventRepository } from "../../../domain/event/repositories/index.js";
import type { CreateEventCommand, EventView } from "../contracts.js";

export class CreateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  public async execute(command: CreateEventCommand): Promise<EventView> {
    const event = Event.create({
      id: newId("event"),
      hostUserId: command.actorUserId,
      title: command.title,
      startsAt: new Date(command.startsAt),
      endsAt: new Date(command.endsAt),
      ...(command.placeId !== undefined ? { placeId: command.placeId } : {}),
      ...(command.summary !== undefined ? { summary: command.summary } : {}),
      ...(command.description !== undefined ? { description: command.description } : {}),
      ...(command.visibility !== undefined ? { visibility: command.visibility } : {}),
    });

    await this.eventRepository.save(event);

    return toView(event);
  }
}

function toView(event: Event): EventView {
  const data = event.toObject();

  return {
    id: data.id,
    hostUserId: data.hostUserId,
    placeId: data.placeId,
    title: data.title,
    summary: data.summary,
    description: data.description,
    startsAt: data.startsAt.toISOString(),
    endsAt: data.endsAt.toISOString(),
    visibility: data.visibility,
    status: data.status,
    publishedAt: data.publishedAt?.toISOString() ?? null,
    cancelledAt: data.cancelledAt?.toISOString() ?? null,
    archivedAt: data.archivedAt?.toISOString() ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}
