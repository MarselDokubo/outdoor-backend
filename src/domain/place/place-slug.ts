import { PlaceValidationError } from "./place.errors.js";

export class PlaceSlug {
  private constructor(private readonly value: string) {}

  public static create(input: string): PlaceSlug {
    const normalized = input.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
      throw new PlaceValidationError(
        "Place slug must contain only lowercase letters, numbers, and hyphens.",
      );
    }
    if (normalized.length > 140) {
      throw new PlaceValidationError("Place slug must not exceed 140 characters.");
    }
    return new PlaceSlug(normalized);
  }

  public static fromName(name: string): PlaceSlug {
    const normalized = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
    return PlaceSlug.create(normalized);
  }

  public toString(): string {
    return this.value;
  }
}
