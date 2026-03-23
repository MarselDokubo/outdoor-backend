import type { PlaceClaimRepository } from "./place-claim.repository.js";
import type { PlaceRepository } from "./place.repository.js";

export interface PlacesTransactionalRepos {
  places: PlaceRepository;
  claims: PlaceClaimRepository;
}

export interface PlacesTransactionManager {
  withTransaction<T>(work: (repos: PlacesTransactionalRepos) => Promise<T>): Promise<T>;
}
