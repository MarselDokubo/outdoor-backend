import type { Place } from "../place.js";
import type { PlaceOwnerMembership } from "../place-owner-membership.js";
import type { PlaceOwnerRole } from "../place.enums.js";

export interface PlaceRepository {
  findById(placeId: string): Promise<Place | null>;
  findBySlug(slug: string): Promise<Place | null>;
  existsSlug(slug: string): Promise<boolean>;
  save(place: Place): Promise<void>;
  getActiveMembership(placeId: string, userId: string): Promise<PlaceOwnerMembership | null>;
  createOrReplaceMembership(input: {
    id: string;
    placeId: string;
    userId: string;
    role: PlaceOwnerRole;
    grantedByUserId: string;
  }): Promise<PlaceOwnerMembership>;
}
