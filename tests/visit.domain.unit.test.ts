import { describe, expect, it } from "vitest";
import { Visit } from "../src/domain/visit/visit.js";

describe("Visit aggregate", () => {
  it("starts an active visit", () => {
    const visit = Visit.start({
      id: "visit_123",
      userId: "user_123",
      placeId: "place_123",
    });

    expect(visit.getStatus()).toBe("ACTIVE");
    expect(visit.getEndedAt()).toBeNull();
  });

  it("ends an active visit", () => {
    const visit = Visit.start({
      id: "visit_123",
      userId: "user_123",
      placeId: "place_123",
      startedAt: new Date("2026-03-24T08:00:00.000Z"),
    });

    visit.end(new Date("2026-03-24T09:00:00.000Z"));

    expect(visit.getStatus()).toBe("COMPLETED");
    expect(visit.getEndedAt()?.toISOString()).toBe("2026-03-24T09:00:00.000Z");
  });
});
