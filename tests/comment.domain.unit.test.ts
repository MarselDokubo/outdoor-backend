import { describe, expect, it } from "vitest";
import { Comment } from "../src/domain/engagement/comment.js";
import { CommentValidationError } from "../src/domain/engagement/comment.errors.js";

describe("Comment aggregate", () => {
  it("creates a valid comment", () => {
    const comment = Comment.create({
      id: "comment_123",
      authorUserId: "user_123",
      targetType: "POST",
      targetId: "post_123",
      body: "This is a useful post.",
    });

    const data = comment.toObject();

    expect(data.status).toBe("ACTIVE");
    expect(data.body).toBe("This is a useful post.");
    expect(data.targetType).toBe("POST");
  });

  it("rejects an empty comment body", () => {
    expect(() =>
      Comment.create({
        id: "comment_123",
        authorUserId: "user_123",
        targetType: "POST",
        targetId: "post_123",
        body: "   ",
      }),
    ).toThrow(CommentValidationError);
  });
});
