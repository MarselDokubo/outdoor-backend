import { cellToLatLng, latLngToCell } from "h3-js";

export interface H3GridPort {
  cellFor(latitude: number, longitude: number): string;
  centerFor(h3Cell: string): [number, number];
}

export class H3GridService implements H3GridPort {
  private static readonly HOTSPOT_RESOLUTION = 8;

  public cellFor(latitude: number, longitude: number): string {
    return latLngToCell(latitude, longitude, H3GridService.HOTSPOT_RESOLUTION);
  }

  public centerFor(h3Cell: string): [number, number] {
    const [latitude, longitude] = cellToLatLng(h3Cell);
    return [latitude, longitude];
  }
}
