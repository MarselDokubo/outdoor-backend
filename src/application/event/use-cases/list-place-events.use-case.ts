import type { EventView, ListPlaceEventsQuery } from "../contracts.js";
import type { EventQueryService } from "./query-services.js";

export class ListPlaceEventsUseCase {
  constructor(private readonly queryService: EventQueryService) {}

  public async execute(query: ListPlaceEventsQuery): Promise<EventView[]> {
    const events = await this.queryService.listByPlace(query.placeId);

    return events.filter((event) => {
      if (query.actorUserId && query.actorUserId === event.hostUserId) {
        return true;
      }

      return event.status === "PUBLISHED" && event.visibility !== "PRIVATE";
    });
  }
}
