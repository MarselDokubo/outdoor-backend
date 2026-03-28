import { describe, expect, it } from "vitest";
import { scoreHotspot } from "../src/domain/hotspot/hotspot-score.js";

describe("hotspot score", () => {
  it("gives higher score to stronger signal mix", () => {
    const weak = scoreHotspot(
      {
        placeId: "place_1",
        slug: "weak",
        name: "Weak",
        categoryCode: "cafe",
        latitude: 4.8,
        longitude: 7.0,
        distanceMeters: 100,
        visitCount: 1,
        reactionCount: 0,
        commentCount: 0,
        saveCount: 0,
        impressionCount: 3,
        followCount: 0,
        activeEventCount: 0,
        recentPostCount: 0,
        lastSignalAt: new Date(),
      },
      "DAY_1",
    );

    const strong = scoreHotspot(
      {
        placeId: "place_2",
        slug: "strong",
        name: "Strong",
        categoryCode: "club",
        latitude: 4.8,
        longitude: 7.0,
        distanceMeters: 100,
        visitCount: 25,
        reactionCount: 12,
        commentCount: 5,
        saveCount: 6,
        impressionCount: 120,
        followCount: 4,
        activeEventCount: 2,
        recentPostCount: 3,
        lastSignalAt: new Date(),
      },
      "DAY_1",
    );

    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.reasons.length).toBeGreaterThan(0);
  });

  it("applies freshness decay", () => {
    const fresh = scoreHotspot(
      {
        placeId: "place_1",
        slug: "fresh",
        name: "Fresh",
        categoryCode: "club",
        latitude: 4.8,
        longitude: 7.0,
        distanceMeters: 100,
        visitCount: 10,
        reactionCount: 4,
        commentCount: 2,
        saveCount: 3,
        impressionCount: 20,
        followCount: 1,
        activeEventCount: 1,
        recentPostCount: 1,
        lastSignalAt: new Date(),
      },
      "LIVE_3H",
    );

    const stale = scoreHotspot(
      {
        placeId: "place_2",
        slug: "stale",
        name: "Stale",
        categoryCode: "club",
        latitude: 4.8,
        longitude: 7.0,
        distanceMeters: 100,
        visitCount: 10,
        reactionCount: 4,
        commentCount: 2,
        saveCount: 3,
        impressionCount: 20,
        followCount: 1,
        activeEventCount: 1,
        recentPostCount: 1,
        lastSignalAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      "LIVE_3H",
    );

    expect(fresh.score).toBeGreaterThan(stale.score);
  });
});
