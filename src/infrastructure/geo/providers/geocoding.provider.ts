import type { Address } from "../../../domain/geo/address";
import type { CityRef } from "../../../domain/geo/city-ref";
import type { GeoPoint } from "../../../domain/geo/geo-point";

export interface GeocodingResult {
  point: GeoPoint;
  address?: Address;
  city?: CityRef;
  provider: string;
  confidence?: number;
}

export interface GeocodingProvider {
  geocode(query: string): Promise<GeocodingResult[]>;
  reverseGeocode(point: GeoPoint): Promise<GeocodingResult | null>;
}
