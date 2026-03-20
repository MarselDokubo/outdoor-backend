import type { GeocodingProvider } from "../../../infrastructure/geo/providers/geocoding.provider";

export class GeocodeAddressUseCase {
  constructor(private readonly geocodingProvider: GeocodingProvider) {}

  async execute(query: string) {
    return this.geocodingProvider.geocode(query);
  }
}
