import { describe, expect, it } from "vitest";
import { Event } from "../src/domain/event/event.js";

describe("Event aggregate", () => {
  it("creates a valid draft event", () => {
    const event = Event.create({
      id: "event_123",
      hostUserId: "user_123",
      placeId: "place_123",
      title: "Sunset Rooftop Session",
      summary: "A rooftop evening event",
      startsAt: new Date("2026-04-01T18:00:00.000Z"),
      endsAt: new Date("2026-04-01T21:00:00.000Z"),
      visibility: "PUBLIC",
    });

    expect(event.toObject().status).toBe("DRAFT");
    expect(event.toObject().title).toBe("Sunset Rooftop Session");
  });

  it("publishes and cancels a host-owned event", () => {
    const event = Event.create({
      id: "event_123",
      hostUserId: "user_123",
      title: "Sunset Rooftop Session",
      startsAt: new Date("2026-04-01T18:00:00.000Z"),
      endsAt: new Date("2026-04-01T21:00:00.000Z"),
    });

    event.publish("user_123");
    event.cancel("user_123");

    expect(event.toObject().status).toBe("CANCELLED");
    expect(event.toObject().publishedAt).not.toBeNull();
    expect(event.toObject().cancelledAt).not.toBeNull();
  });
});
