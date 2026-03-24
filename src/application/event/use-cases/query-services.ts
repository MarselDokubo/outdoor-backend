import type { EventView } from "../contracts.js";

export interface EventQueryService {
  getById(eventId: string): Promise<EventView | null>;
  listByPlace(placeId: string): Promise<EventView[]>;
  listByHost(hostUserId: string): Promise<EventView[]>;
}
