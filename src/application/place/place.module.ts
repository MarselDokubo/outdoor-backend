import { CreatePlaceHandler } from "./use-cases/create-place.use-case.js";
import { UpdatePlaceHandler } from "./use-cases/update-place.use-case.js";
import { PublishPlaceHandler } from "./use-cases/publish-place.use-case.js";
import { ArchivePlaceHandler } from "./use-cases/archive-place.use-case.js";
import { UpdateOfficialPlaceProfileHandler } from "./use-cases/update-official-place-profile.use-case.js";
import { SubmitPlaceClaimHandler } from "./use-cases/submit-place-claim.use-case.js";
import { ReviewPlaceClaimHandler } from "./use-cases/review-place-claim.use-case.js";
import { GetPlaceDetailsHandler } from "./use-cases/get-place-details.use-case.js";
import { SearchPlacesHandler } from "./use-cases/search-places.use-case.js";
import { FindNearbyPlacesHandler } from "./use-cases/find-nearby-places.use-case.js";
import { SearchPlacesForTaggingHandler } from "./use-cases/search-places-for-tagging.use-case.js";
import { ListMyOwnedPlacesHandler } from "./use-cases/list-my-owned-places.use-case.js";
import { ListPendingPlaceClaimsHandler } from "./use-cases/list-pending-place-claims.use-case.js";
import { PrismaPlaceRepository } from "../../infrastructure/persistence/prisma/prisma-place.repository.js";
import { PrismaPlaceQueryService } from "../../infrastructure/persistence/prisma/prisma-place-query.repository.js";
import { PrismaPlaceSlugUniquenessService } from "../../infrastructure/persistence/prisma/prisma-place-slug-uniqueness.service.js";
import { PrismaPlacesTransactionManager } from "../../infrastructure/persistence/prisma/prisma-places-transaction-manager.js";

export {
  CreatePlaceHandler,
  UpdatePlaceHandler,
  PublishPlaceHandler,
  ArchivePlaceHandler,
  UpdateOfficialPlaceProfileHandler,
  SubmitPlaceClaimHandler,
  ReviewPlaceClaimHandler,
  GetPlaceDetailsHandler,
  SearchPlacesHandler,
  FindNearbyPlacesHandler,
  SearchPlacesForTaggingHandler,
  ListMyOwnedPlacesHandler,
  ListPendingPlaceClaimsHandler,
};

import type { PlacesPrismaClient } from "../../infrastructure/persistence/prisma/place-prisma.types.js";

export function buildPlaceModule(prisma: PlacesPrismaClient) {
  const placeRepository = new PrismaPlaceRepository(prisma);
  const queryService = new PrismaPlaceQueryService(prisma);
  const transactionManager = new PrismaPlacesTransactionManager(prisma);
  const slugService = new PrismaPlaceSlugUniquenessService(placeRepository);

  return {
    createPlace: new CreatePlaceHandler(transactionManager, slugService),
    updatePlace: new UpdatePlaceHandler(placeRepository),
    publishPlace: new PublishPlaceHandler(placeRepository),
    archivePlace: new ArchivePlaceHandler(placeRepository),
    updateOfficialProfile: new UpdateOfficialPlaceProfileHandler(placeRepository),
    submitClaim: new SubmitPlaceClaimHandler(transactionManager),
    reviewClaim: new ReviewPlaceClaimHandler(transactionManager),
    getPlaceDetails: new GetPlaceDetailsHandler(queryService, placeRepository),
    searchPlaces: new SearchPlacesHandler(queryService),
    findNearbyPlaces: new FindNearbyPlacesHandler(queryService),
    searchPlacesForTagging: new SearchPlacesForTaggingHandler(queryService),
    listMyOwnedPlaces: new ListMyOwnedPlacesHandler(queryService),
    listPendingPlaceClaims: new ListPendingPlaceClaimsHandler(queryService),
  };
}
