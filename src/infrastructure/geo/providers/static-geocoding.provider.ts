import type { GeoPoint } from "../../../domain/geo/geo-point";
import { DistanceService } from "../../../application/geo/services/distance.service";
import type { GeocodingProvider, GeocodingResult } from "./geocoding.provider";

const FIXTURES: GeocodingResult[] = [
  {
    provider: "static",
    confidence: 0.99,
    point: { latitude: 4.8156, longitude: 7.0498 },
    address: {
      formatted: "Port Harcourt, Rivers, Nigeria",
      city: "Port Harcourt",
      stateOrRegion: "Rivers",
      country: "Nigeria",
    },
    city: {
      citySlug: "port-harcourt",
      cityName: "Port Harcourt",
      countryCode: "NG",
    },
  },
  {
    provider: "static",
    confidence: 0.96,
    point: { latitude: 4.8484, longitude: 7.0219 },
    address: {
      formatted: "Port Harcourt Pleasure Park, Port Harcourt, Rivers, Nigeria",
      line1: "Port Harcourt Pleasure Park",
      city: "Port Harcourt",
      stateOrRegion: "Rivers",
      country: "Nigeria",
      landmark: "Pleasure Park",
    },
    city: {
      citySlug: "port-harcourt",
      cityName: "Port Harcourt",
      countryCode: "NG",
    },
  },
  {
    provider: "static",
    confidence: 0.95,
    point: { latitude: 4.7932, longitude: 7.0337 },
    address: {
      formatted: "GRA, Port Harcourt, Rivers, Nigeria",
      city: "Port Harcourt",
      stateOrRegion: "Rivers",
      country: "Nigeria",
      landmark: "GRA",
    },
    city: {
      citySlug: "port-harcourt",
      cityName: "Port Harcourt",
      countryCode: "NG",
      areaSlug: "gra",
      areaName: "GRA",
    },
  },
];

export class StaticGeocodingProvider implements GeocodingProvider {
  private readonly distanceService = new DistanceService();

  async geocode(query: string): Promise<GeocodingResult[]> {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return FIXTURES.filter((item) => {
      const haystacks = [
        item.address?.formatted,
        item.address?.line1,
        item.address?.city,
        item.city?.cityName,
        item.city?.areaName,
      ]
        .filter(Boolean)
        .map((value) => value!.toLowerCase());

      return haystacks.some((value) => value.includes(normalized));
    });
  }

  async reverseGeocode(point: GeoPoint): Promise<GeocodingResult | null> {
    const ranked = FIXTURES.map((item) => ({
      item,
      distanceMeters: this.distanceService.betweenInMeters(point, item.point),
    })).sort((a, b) => a.distanceMeters - b.distanceMeters);

    const best = ranked[0];

    if (!best || best.distanceMeters > 10_000) {
      return null;
    }

    return best.item;
  }
}
