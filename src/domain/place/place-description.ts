import { PlaceValidationError } from "./place.errors.js";

export interface PlaceDescriptionProps {
  shortDescription?: string | null | undefined;
  fullDescription?: string | null | undefined;
}

export class PlaceDescription {
  private constructor(
    public readonly shortDescription: string | null,
    public readonly fullDescription: string | null,
  ) {}

  public static create(props: PlaceDescriptionProps): PlaceDescription {
    const shortDescription = normalizeOptionalText(props.shortDescription);
    const fullDescription = normalizeOptionalText(props.fullDescription);

    if (shortDescription && shortDescription.length > 280) {
      throw new PlaceValidationError("Short description must not exceed 280 characters.");
    }

    if (fullDescription && fullDescription.length > 5000) {
      throw new PlaceValidationError("Full description must not exceed 5000 characters.");
    }

    return new PlaceDescription(shortDescription, fullDescription);
  }
}

function normalizeOptionalText(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized || null;
}
