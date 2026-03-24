import { describe, expect, it } from "vitest";
import { Post } from "../src/domain/post/post.js";

describe("Post aggregate", () => {
  it("creates a valid draft post", () => {
    const post = Post.create({
      id: "post_123",
      authorUserId: "user_123",
      placeId: "place_123",
      body: "Port Harcourt is alive tonight.",
      visibility: "PUBLIC",
    });

    expect(post.publicationStatus).toBe("DRAFT");
    expect(post.body).toBe("Port Harcourt is alive tonight.");
  });

  it("publishes a draft post", () => {
    const post = Post.create({
      id: "post_123",
      authorUserId: "user_123",
      placeId: "place_123",
      body: "Port Harcourt is alive tonight.",
      visibility: "PUBLIC",
    });

    post.publish("user_123");

    expect(post.publicationStatus).toBe("PUBLISHED");
    expect(post.publishedAt).not.toBeNull();
  });
});
