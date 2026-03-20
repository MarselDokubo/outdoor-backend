export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

export function createGeoPoint(latitude: number, longitude: number): GeoPoint {
  if (!isValidLatitude(latitude)) {
    throw new Error(`Invalid latitude: ${latitude}`);
  }

  if (!isValidLongitude(longitude)) {
    throw new Error(`Invalid longitude: ${longitude}`);
  }

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
}
