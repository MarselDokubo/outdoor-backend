import { describe, expect, it } from "vitest";
import { Follow } from "../src/domain/engagement/follow.js";
import { FollowValidationError } from "../src/domain/engagement/follow.errors.js";

describe("Follow aggregate", () => {
  it("creates a valid place follow", () => {
    const follow = Follow.create({
      id: "follow_123",
      followerUserId: "user_123",
      targetType: "PLACE",
      targetId: "place_123",
    });

    const data = follow.toObject();
    expect(data.followerUserId).toBe("user_123");
    expect(data.targetType).toBe("PLACE");
    expect(data.targetId).toBe("place_123");
  });

  it("prevents users from following themselves", () => {
    expect(() =>
      Follow.create({
        id: "follow_123",
        followerUserId: "user_123",
        targetType: "USER",
        targetId: "user_123",
      }),
    ).toThrow(FollowValidationError);
  });
});
