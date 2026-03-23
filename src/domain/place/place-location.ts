import { PlaceValidationError } from "./place.errors.js";

export interface PlaceLocationProps {
  latitude: number;
  longitude: number;
  addressLine1?: string | null | undefined;
  addressLine2?: string | null | undefined;
  area?: string | null | undefined;
  city?: string | null | undefined;
  state?: string | null | undefined;
  postalCode?: string | null | undefined;
  countryCode: string;
  formattedAddress?: string | null | undefined;
}

export class PlaceLocation {
  private constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly addressLine1: string | null,
    public readonly addressLine2: string | null,
    public readonly area: string | null,
    public readonly city: string | null,
    public readonly state: string | null,
    public readonly postalCode: string | null,
    public readonly countryCode: string,
    public readonly formattedAddress: string | null,
  ) {}

  public static create(props: PlaceLocationProps): PlaceLocation {
    if (!Number.isFinite(props.latitude) || props.latitude < -90 || props.latitude > 90) {
      throw new PlaceValidationError("Latitude must be a valid number between -90 and 90.");
    }

    if (!Number.isFinite(props.longitude) || props.longitude < -180 || props.longitude > 180) {
      throw new PlaceValidationError("Longitude must be a valid number between -180 and 180.");
    }

    const countryCode = props.countryCode.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(countryCode)) {
      throw new PlaceValidationError("Country code must be a valid ISO-3166 alpha-2 code.");
    }

    const normalizedAddressLine1 = normalizeOptionalText(props.addressLine1);
    const normalizedCity = normalizeOptionalText(props.city);

    if (!normalizedAddressLine1 && !normalizedCity && !props.formattedAddress?.trim()) {
      throw new PlaceValidationError(
        "A place location must include at least an address line, city, or formatted address.",
      );
    }

    return new PlaceLocation(
      roundCoordinate(props.latitude),
      roundCoordinate(props.longitude),
      normalizedAddressLine1,
      normalizeOptionalText(props.addressLine2),
      normalizeOptionalText(props.area),
      normalizedCity,
      normalizeOptionalText(props.state),
      normalizeOptionalText(props.postalCode),
      countryCode,
      normalizeOptionalText(props.formattedAddress),
    );
  }
}

function normalizeOptionalText(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized || null;
}

function roundCoordinate(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}
