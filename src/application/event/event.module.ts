import type { EventPrismaClient } from "../../infrastructure/persistence/prisma/event-prisma.types.js";
import { PrismaEventQueryService } from "../../infrastructure/persistence/prisma/prisma-event-query.repository.js";
import { PrismaEventRepository } from "../../infrastructure/persistence/prisma/prisma-event.repository.js";
import { ArchiveEventUseCase } from "./use-cases/archive-event.use-case.js";
import { CancelEventUseCase } from "./use-cases/cancel-event.use-case.js";
import { CreateEventUseCase } from "./use-cases/create-event.use-case.js";
import { GetEventDetailsUseCase } from "./use-cases/get-event-details.use-case.js";
import { ListMyEventsUseCase } from "./use-cases/list-my-events.use-case.js";
import { ListPlaceEventsUseCase } from "./use-cases/list-place-events.use-case.js";
import { PublishEventUseCase } from "./use-cases/publish-event.use-case.js";
import { UpdateEventUseCase } from "./use-cases/update-event.use-case.js";

export function buildEventModule(prisma: EventPrismaClient) {
  const eventRepository = new PrismaEventRepository(prisma);
  const queryService = new PrismaEventQueryService(prisma);

  return {
    createEvent: new CreateEventUseCase(eventRepository),
    updateEvent: new UpdateEventUseCase(eventRepository),
    publishEvent: new PublishEventUseCase(eventRepository),
    cancelEvent: new CancelEventUseCase(eventRepository),
    archiveEvent: new ArchiveEventUseCase(eventRepository),
    getEventDetails: new GetEventDetailsUseCase(queryService),
    listPlaceEvents: new ListPlaceEventsUseCase(queryService),
    listMyEvents: new ListMyEventsUseCase(queryService),
  };
}
