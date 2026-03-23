import { PLACE_CATEGORY_CODES, type PlaceCategoryCode } from "./place.enums.js";
import { PlaceValidationError } from "./place.errors.js";

export class PlaceCategory {
  private constructor(private readonly value: PlaceCategoryCode) {}

  public static create(input: string): PlaceCategory {
    const normalized = input.trim().toUpperCase() as PlaceCategoryCode;
    if (!PLACE_CATEGORY_CODES.includes(normalized)) {
      throw new PlaceValidationError("Invalid place category.", {
        allowedValues: PLACE_CATEGORY_CODES,
      });
    }
    return new PlaceCategory(normalized);
  }

  public toString(): PlaceCategoryCode {
    return this.value;
  }
}
