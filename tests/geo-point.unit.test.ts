import { describe, expect, it } from "vitest";
import { createGeoPoint } from "../src/domain/geo/geo-point";

describe("GeoPoint", () => {
  it("creates a valid point", () => {
    expect(createGeoPoint(4.8156, 7.0498)).toEqual({
      latitude: 4.8156,
      longitude: 7.0498,
    });
  });

  it("rejects invalid latitude", () => {
    expect(() => createGeoPoint(200, 7.0498)).toThrow(/Invalid latitude/);
  });

  it("rejects invalid longitude", () => {
    expect(() => createGeoPoint(4.8156, 400)).toThrow(/Invalid longitude/);
  });
});
