import { EventAccessDeniedError, EventValidationError } from "./event.errors.js";
import type { EventStatus, EventVisibility } from "./event.enums.js";

export interface EventProps {
  id: string;
  hostUserId: string;
  placeId: string | null;
  title: string;
  summary: string | null;
  description: string | null;
  startsAt: Date;
  endsAt: Date;
  visibility: EventVisibility;
  status: EventStatus;
  publishedAt: Date | null;
  cancelledAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventProps {
  id: string;
  hostUserId: string;
  placeId?: string | null;
  title: string;
  summary?: string | null;
  description?: string | null;
  startsAt: Date;
  endsAt: Date;
  visibility?: EventVisibility;
}

export interface UpdateEventProps {
  title?: string | null;
  summary?: string | null;
  description?: string | null;
  startsAt?: Date;
  endsAt?: Date;
  visibility?: EventVisibility;
  placeId?: string | null;
}

export class Event {
  private constructor(private props: EventProps) {}

  public static create(props: CreateEventProps): Event {
    const now = new Date();
    const title = normalizeTitle(props.title);
    validateTitle(title);
    validateTimeWindow(props.startsAt, props.endsAt);

    return new Event({
      id: props.id,
      hostUserId: props.hostUserId,
      placeId: props.placeId ?? null,
      title,
      summary: normalizeOptionalText(props.summary),
      description: normalizeOptionalText(props.description),
      startsAt: props.startsAt,
      endsAt: props.endsAt,
      visibility: props.visibility ?? "PUBLIC",
      status: "DRAFT",
      publishedAt: null,
      cancelledAt: null,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static rehydrate(props: EventProps): Event {
    return new Event(props);
  }

  public update(actorUserId: string, changes: UpdateEventProps): void {
    this.assertHost(actorUserId);
    this.assertMutable();

    const nextTitle =
      changes.title === undefined ? this.props.title : normalizeTitle(changes.title);
    validateTitle(nextTitle);

    const nextStartsAt = changes.startsAt ?? this.props.startsAt;
    const nextEndsAt = changes.endsAt ?? this.props.endsAt;
    validateTimeWindow(nextStartsAt, nextEndsAt);

    this.props = {
      ...this.props,
      title: nextTitle,
      summary:
        changes.summary === undefined ? this.props.summary : normalizeOptionalText(changes.summary),
      description:
        changes.description === undefined
          ? this.props.description
          : normalizeOptionalText(changes.description),
      startsAt: nextStartsAt,
      endsAt: nextEndsAt,
      visibility: changes.visibility ?? this.props.visibility,
      placeId: changes.placeId === undefined ? this.props.placeId : changes.placeId,
      updatedAt: new Date(),
    };
  }

  public publish(actorUserId: string): void {
    this.assertHost(actorUserId);

    if (this.props.status === "PUBLISHED") {
      return;
    }

    if (this.props.status === "ARCHIVED") {
      throw new EventValidationError("Archived events cannot be published.");
    }

    if (this.props.status === "CANCELLED") {
      throw new EventValidationError("Cancelled events cannot be published.");
    }

    validateTitle(this.props.title);
    validateTimeWindow(this.props.startsAt, this.props.endsAt);

    const now = new Date();
    this.props = {
      ...this.props,
      status: "PUBLISHED",
      publishedAt: this.props.publishedAt ?? now,
      updatedAt: now,
    };
  }

  public cancel(actorUserId: string): void {
    this.assertHost(actorUserId);

    if (this.props.status === "ARCHIVED") {
      throw new EventValidationError("Archived events cannot be cancelled.");
    }

    if (this.props.status === "CANCELLED") {
      return;
    }

    const now = new Date();
    this.props = {
      ...this.props,
      status: "CANCELLED",
      cancelledAt: this.props.cancelledAt ?? now,
      updatedAt: now,
    };
  }

  public archive(actorUserId: string): void {
    this.assertHost(actorUserId);

    if (this.props.status === "ARCHIVED") {
      return;
    }

    const now = new Date();
    this.props = {
      ...this.props,
      status: "ARCHIVED",
      archivedAt: this.props.archivedAt ?? now,
      updatedAt: now,
    };
  }

  public canBeViewedBy(actorUserId?: string | null): boolean {
    if (actorUserId && actorUserId === this.props.hostUserId) {
      return true;
    }

    if (this.props.status !== "PUBLISHED") {
      return false;
    }

    return this.props.visibility !== "PRIVATE";
  }

  public assertViewableBy(actorUserId?: string | null): void {
    if (!this.canBeViewedBy(actorUserId)) {
      throw new EventAccessDeniedError();
    }
  }

  public isHostedBy(userId: string): boolean {
    return this.props.hostUserId === userId;
  }

  public toObject(): EventProps {
    return { ...this.props };
  }

  private assertHost(actorUserId: string): void {
    if (this.props.hostUserId !== actorUserId) {
      throw new EventAccessDeniedError("Only the host can manage this event.");
    }
  }

  private assertMutable(): void {
    if (this.props.status === "ARCHIVED") {
      throw new EventValidationError("Archived events cannot be modified.");
    }

    if (this.props.status === "CANCELLED") {
      throw new EventValidationError("Cancelled events cannot be modified.");
    }
  }
}

function normalizeTitle(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return value.trim();
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim();
  return normalized || null;
}

function validateTitle(value: string): void {
  if (!value || value.trim().length < 3) {
    throw new EventValidationError("Event title must be at least 3 characters.");
  }

  if (value.trim().length > 140) {
    throw new EventValidationError("Event title must not exceed 140 characters.");
  }
}

function validateTimeWindow(startsAt: Date, endsAt: Date): void {
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    throw new EventValidationError("Event start and end time must be valid dates.");
  }

  if (endsAt <= startsAt) {
    throw new EventValidationError("Event end time must be after start time.");
  }
}
