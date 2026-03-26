import { describe, expect, it } from "vitest";
import { Impression } from "../src/domain/engagement/impression.js";
import { ImpressionValidationError } from "../src/domain/engagement/impression.errors.js";

describe("Impression domain", () => {
  it("creates an impression when viewer user id is present", () => {
    const impression = Impression.create({
      id: "impression_123",
      targetType: "POST",
      targetId: "post_123",
      viewerUserId: "user_123",
    });

    expect(impression.toObject().viewerUserId).toBe("user_123");
    expect(impression.toObject().sessionKey).toBeNull();
  });

  it("rejects an impression without viewer or session", () => {
    expect(() =>
      Impression.create({
        id: "impression_123",
        targetType: "POST",
        targetId: "post_123",
      }),
    ).toThrow(ImpressionValidationError);
  });
});
