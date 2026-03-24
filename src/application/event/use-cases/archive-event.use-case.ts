import { EventNotFoundError } from "../../../domain/event/event.errors.js";
import type { EventRepository } from "../../../domain/event/repositories/index.js";
import type { EventLifecycleCommand, EventView } from "../contracts.js";

export class ArchiveEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  public async execute(command: EventLifecycleCommand): Promise<EventView> {
    const event = await this.eventRepository.findById(command.eventId);
    if (!event) throw new EventNotFoundError();

    event.archive(command.actorUserId);
    await this.eventRepository.save(event);

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
}
