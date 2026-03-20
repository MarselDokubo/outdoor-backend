import { createGeoPoint } from "../../../domain/geo/geo-point";
import type { GeocodingProvider } from "../../../infrastructure/geo/providers/geocoding.provider";

export class ReverseGeocodePointUseCase {
  constructor(private readonly geocodingProvider: GeocodingProvider) {}

  async execute(latitude: number, longitude: number) {
    const point = createGeoPoint(latitude, longitude);
    return this.geocodingProvider.reverseGeocode(point);
  }
}
