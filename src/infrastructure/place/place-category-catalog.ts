import { PLACE_CATEGORY_CODES, type PlaceCategoryCode } from "../../domain/place/place.enums.js";

export interface PlaceCategoryView {
  code: PlaceCategoryCode;
  label: string;
}

export const PLACE_CATEGORY_CATALOG: PlaceCategoryView[] = PLACE_CATEGORY_CODES.map(
  (code: PlaceCategoryCode) => ({
    code,
    label: code
      .toLowerCase()
      .split("_")
      .map((part: string) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
      .join(" "),
  }),
);
