import type { EventView, ListMyEventsQuery } from "../contracts.js";
import type { EventQueryService } from "./query-services.js";

export class ListMyEventsUseCase {
  constructor(private readonly queryService: EventQueryService) {}

  public async execute(query: ListMyEventsQuery): Promise<EventView[]> {
    return this.queryService.listByHost(query.actorUserId);
  }
}
