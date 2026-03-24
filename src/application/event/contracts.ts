import type { EventStatus, EventVisibility } from "../../domain/event/event.enums.js";

export interface CreateEventCommand {
  actorUserId: string;
  placeId?: string | null;
  title: string;
  summary?: string | null;
  description?: string | null;
  startsAt: string;
  endsAt: string;
  visibility?: EventVisibility;
}

export interface UpdateEventCommand {
  actorUserId: string;
  eventId: string;
  placeId?: string | null;
  title?: string | null;
  summary?: string | null;
  description?: string | null;
  startsAt?: string;
  endsAt?: string;
  visibility?: EventVisibility;
}

export interface EventLifecycleCommand {
  actorUserId: string;
  eventId: string;
}

export interface GetEventDetailsQuery {
  actorUserId?: string | null;
  eventId: string;
}

export interface ListPlaceEventsQuery {
  actorUserId?: string | null;
  placeId: string;
}

export interface ListMyEventsQuery {
  actorUserId: string;
}

export interface EventView {
  id: string;
  hostUserId: string;
  placeId: string | null;
  title: string;
  summary: string | null;
  description: string | null;
  startsAt: string;
  endsAt: string;
  visibility: EventVisibility;
  status: EventStatus;
  publishedAt: string | null;
  cancelledAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
