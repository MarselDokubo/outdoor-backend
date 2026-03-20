import type { GeoPoint } from "../../../domain/geo/geo-point";

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export class DistanceService {
  betweenInMeters(a: GeoPoint, b: GeoPoint): number {
    const dLat = toRadians(b.latitude - a.latitude);
    const dLon = toRadians(b.longitude - a.longitude);

    const lat1 = toRadians(a.latitude);
    const lat2 = toRadians(b.latitude);

    const haversine =
      Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    return EARTH_RADIUS_METERS * c;
  }

  betweenInKilometers(a: GeoPoint, b: GeoPoint): number {
    return this.betweenInMeters(a, b) / 1000;
  }
}
