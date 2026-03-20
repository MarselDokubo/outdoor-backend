import type { Address } from "./address";
import type { CityRef } from "./city-ref";
import type { GeoPoint } from "./geo-point";

export type GeoLocationSource =
  | "device"
  | "manual"
  | "provider_geocoded"
  | "admin_entered"
  | "seeded"
  | "unknown";

export interface GeoLocation {
  point: GeoPoint;
  address?: Address;
  city?: CityRef;
  source: GeoLocationSource;
  accuracyMeters?: number;
  capturedAt?: Date;
}
