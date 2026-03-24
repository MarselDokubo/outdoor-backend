import { PostValidationError } from "./post.errors.js";

export class PostBody {
  private constructor(public readonly value: string) {}

  public static create(input: string): PostBody {
    const normalized = input.trim();

    if (!normalized) {
      throw new PostValidationError("Post body is required.");
    }

    if (normalized.length > 2200) {
      throw new PostValidationError("Post body must not exceed 2200 characters.");
    }

    return new PostBody(normalized);
  }
}
