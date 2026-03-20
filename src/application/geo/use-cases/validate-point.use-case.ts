import { createGeoPoint, type GeoPoint } from "../../../domain/geo/geo-point";

export class ValidatePointUseCase {
  execute(latitude: number, longitude: number): GeoPoint {
    return createGeoPoint(latitude, longitude);
  }
}
