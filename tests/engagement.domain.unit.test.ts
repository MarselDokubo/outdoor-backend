import { describe, expect, it } from "vitest";
import { Reaction } from "../src/domain/engagement/reaction.js";
import { Save } from "../src/domain/engagement/save.js";

describe("Engagement domain", () => {
  it("updates reaction type", () => {
    const reaction = Reaction.create({
      id: "reaction_123",
      userId: "user_123",
      targetType: "POST",
      targetId: "post_123",
      reactionType: "LIKE",
    });

    reaction.changeReactionType("FIRE");

    expect(reaction.toObject().reactionType).toBe("FIRE");
  });

  it("creates a save", () => {
    const item = Save.create({
      id: "save_123",
      userId: "user_123",
      targetType: "EVENT",
      targetId: "event_123",
    });

    expect(item.toObject().targetType).toBe("EVENT");
    expect(item.toObject().targetId).toBe("event_123");
  });
});
