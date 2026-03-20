import { describe, expect, it } from "vitest";
import { StaticGeocodingProvider } from "../src/infrastructure/geo/providers/static-geocoding.provider";
import { createGeoPoint } from "../src/domain/geo/geo-point";

describe("StaticGeocodingProvider", () => {
  const provider = new StaticGeocodingProvider();

  it("geocode normalizes a known query into internal result shape", async () => {
    const results = await provider.geocode("Port Harcourt Pleasure Park");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("point");
    expect(results[0]).toHaveProperty("address");
    expect(results[0]?.address?.formatted).toBeTruthy();
  });

  it("geocode returns empty array for unknown query", async () => {
    const results = await provider.geocode("Some completely unknown place 12345");
    expect(results).toEqual([]);
  });

  it("reverseGeocode returns a structured result for a known point", async () => {
    const result = await provider.reverseGeocode(createGeoPoint(4.8156, 7.0498));

    expect(result).toBeTruthy();
    expect(result).toHaveProperty("address");
    expect(result).toHaveProperty("point");
  });
});
