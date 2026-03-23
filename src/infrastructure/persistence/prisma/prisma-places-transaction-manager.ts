import type {
  PlacesTransactionalRepos,
  PlacesTransactionManager,
} from "../../../domain/place/repositories/index.js";
import type { PlacesPrismaClient, PlacesPrismaTransactionClient } from "./place-prisma.types.js";
import { PrismaPlaceClaimRepository } from "./prisma-place-claim.repository.js";
import { PrismaPlaceRepository } from "./prisma-place.repository.js";

export class PrismaPlacesTransactionManager implements PlacesTransactionManager {
  constructor(private readonly prisma: PlacesPrismaClient) {}

  public withTransaction<T>(work: (repos: PlacesTransactionalRepos) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const repos = this.makeRepos(tx as PlacesPrismaTransactionClient);
      return work(repos);
    });
  }

  private makeRepos(tx: PlacesPrismaTransactionClient): PlacesTransactionalRepos {
    return {
      places: new PrismaPlaceRepository(tx),
      claims: new PrismaPlaceClaimRepository(tx),
    };
  }
}
