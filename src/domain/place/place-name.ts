import { PlaceValidationError } from "./place.errors.js";

export class PlaceName {
  private constructor(private readonly value: string) {}

  public static create(input: string): PlaceName {
    const normalized = input.trim().replace(/\s+/g, " ");
    if (!normalized) {
      throw new PlaceValidationError("Place name is required.");
    }
    if (normalized.length < 2 || normalized.length > 120) {
      throw new PlaceValidationError("Place name must be between 2 and 120 characters.");
    }
    return new PlaceName(normalized);
  }

  public toString(): string {
    return this.value;
  }
}
