import { describe, expect, it } from "vitest";
import { Place } from "../src/domain/place/place.js";
import { PlaceClaim } from "../src/domain/place/place-claim.js";

function validLocation() {
  return {
    latitude: 4.815554,
    longitude: 7.049844,
    addressLine1: "1 Old GRA Road",
    city: "Port Harcourt",
    state: "Rivers",
    countryCode: "NG",
    formattedAddress: "1 Old GRA Road, Port Harcourt, Rivers, Nigeria",
  };
}

describe("Place aggregate", () => {
  it("creates a valid draft place", () => {
    const place = Place.create({
      id: "place_1",
      slug: "genesis-lounge",
      name: "Genesis Lounge",
      category: "NIGHTLIFE",
      location: validLocation(),
      createdByUserId: "user_1",
    });

    expect(place.getSlug()).toBe("genesis-lounge");
    expect(place.getPublicationStatus()).toBe("DRAFT");
    expect(place.getVisibility()).toBe("PRIVATE");
  });

  it("publishes when location is valid", () => {
    const place = Place.create({
      id: "place_2",
      slug: "noble-cafe",
      name: "Noble Cafe",
      category: "CAFE",
      location: validLocation(),
      publicationStatus: "DRAFT",
      visibility: "PUBLIC",
      createdByUserId: "user_1",
    });

    place.publish();

    expect(place.getPublicationStatus()).toBe("PUBLISHED");
  });
});

describe("Place claim aggregate", () => {
  it("requires at least one proof", () => {
    expect(() =>
      PlaceClaim.create({
        id: "claim_1",
        placeId: "place_1",
        claimantUserId: "user_1",
        proofReferences: [],
      }),
    ).toThrowError();
  });

  it("approves a valid claim", () => {
    const claim = PlaceClaim.create({
      id: "claim_2",
      placeId: "place_1",
      claimantUserId: "user_1",
      proofReferences: [
        {
          kind: "BUSINESS_REGISTRATION",
          fileKey: "proofs/business-reg.pdf",
        },
      ],
    });

    claim.approve("admin_1", "Verified CAC certificate.");

    expect(claim.getStatus()).toBe("APPROVED");
  });
});
