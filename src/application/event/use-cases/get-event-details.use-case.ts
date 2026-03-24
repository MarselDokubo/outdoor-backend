import { EventAccessDeniedError, EventNotFoundError } from "../../../domain/event/event.errors.js";
import type { GetEventDetailsQuery, EventView } from "../contracts.js";
import type { EventQueryService } from "./query-services.js";

export class GetEventDetailsUseCase {
  constructor(private readonly queryService: EventQueryService) {}

  public async execute(query: GetEventDetailsQuery): Promise<EventView> {
    const event = await this.queryService.getById(query.eventId);
    if (!event) throw new EventNotFoundError();

    const isHost = Boolean(query.actorUserId && query.actorUserId === event.hostUserId);
    const publiclyVisible = event.status === "PUBLISHED" && event.visibility !== "PRIVATE";

    if (!isHost && !publiclyVisible) {
      throw new EventAccessDeniedError();
    }

    return event;
  }
}
