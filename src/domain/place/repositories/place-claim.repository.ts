import type { PlaceClaim } from "../place-claim.js";

export interface PlaceClaimRepository {
  findById(claimId: string): Promise<PlaceClaim | null>;
  findPendingClaimForPlaceAndUser(placeId: string, userId: string): Promise<PlaceClaim | null>;
  save(claim: PlaceClaim): Promise<void>;
}
