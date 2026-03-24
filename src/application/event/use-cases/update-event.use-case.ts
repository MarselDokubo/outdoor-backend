import { EventNotFoundError } from "../../../domain/event/event.errors.js";
import type { EventRepository } from "../../../domain/event/repositories/index.js";
import type { EventView, UpdateEventCommand } from "../contracts.js";

export class UpdateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  public async execute(command: UpdateEventCommand): Promise<EventView> {
    const event = await this.eventRepository.findById(command.eventId);

    if (!event) {
      throw new EventNotFoundError();
    }

    event.update(command.actorUserId, {
      ...(command.placeId !== undefined ? { placeId: command.placeId } : {}),
      ...(command.title !== undefined ? { title: command.title } : {}),
      ...(command.summary !== undefined ? { summary: command.summary } : {}),
      ...(command.description !== undefined ? { description: command.description } : {}),
      ...(command.startsAt !== undefined ? { startsAt: new Date(command.startsAt) } : {}),
      ...(command.endsAt !== undefined ? { endsAt: new Date(command.endsAt) } : {}),
      ...(command.visibility !== undefined ? { visibility: command.visibility } : {}),
    });

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
