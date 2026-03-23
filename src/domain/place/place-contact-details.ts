import { PlaceValidationError } from "./place.errors.js";

export interface PlaceContactDetailsProps {
  phone?: string | null | undefined;
  email?: string | null | undefined;
  website?: string | null | undefined;
}

export class PlaceContactDetails {
  private constructor(
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly website: string | null,
  ) {}

  public static create(props: PlaceContactDetailsProps): PlaceContactDetails {
    const phone = normalizeOptionalText(props.phone);
    const email = normalizeOptionalText(props.email)?.toLowerCase() ?? null;
    const website = normalizeOptionalText(props.website) ?? null;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new PlaceValidationError("Invalid contact email.");
    }

    if (website) {
      try {
        const parsed = new URL(website);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new PlaceValidationError("Website URL must use http or https.");
        }
      } catch {
        throw new PlaceValidationError("Invalid website URL.");
      }
    }

    if (phone && phone.length > 40) {
      throw new PlaceValidationError("Phone number must not exceed 40 characters.");
    }

    return new PlaceContactDetails(phone, email, website);
  }
}

function normalizeOptionalText(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim();
  return normalized || null;
}
