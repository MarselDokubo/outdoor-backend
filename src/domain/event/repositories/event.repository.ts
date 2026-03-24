import type { Event } from "../event.js";

export interface EventRepository {
  findById(eventId: string): Promise<Event | null>;
  save(event: Event): Promise<void>;
}
