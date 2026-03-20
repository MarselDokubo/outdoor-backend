import type { GeoPoint } from "../../../domain/geo/geo-point";

export interface BoundingBox {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
}

const EARTH_RADIUS_METERS = 6_371_000;

function toDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

export class BoundingBoxService {
  fromPointAndRadius(point: GeoPoint, radiusMeters: number): BoundingBox {
    const angularDistance = radiusMeters / EARTH_RADIUS_METERS;

    const latDelta = toDegrees(angularDistance);
    const lonDelta = toDegrees(angularDistance / Math.cos((point.latitude * Math.PI) / 180));

    return {
      minLatitude: point.latitude - latDelta,
      maxLatitude: point.latitude + latDelta,
      minLongitude: point.longitude - lonDelta,
      maxLongitude: point.longitude + lonDelta,
    };
  }
}
