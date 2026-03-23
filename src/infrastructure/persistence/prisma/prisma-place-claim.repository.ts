import type { Prisma } from "../../../generated/prisma/client.js";
import type { PlaceClaimRepository } from "../../../domain/place/repositories/index.js";
import type { PlaceClaim } from "../../../domain/place/place-claim.js";
import type { PlacesPrismaClient, PlacesPrismaTransactionClient } from "./place-prisma.types.js";
import { toPlaceClaimEntity, toPlaceClaimPersistence } from "./place-mappers.js";

type PrismaDb = PlacesPrismaClient | PlacesPrismaTransactionClient;

export class PrismaPlaceClaimRepository implements PlaceClaimRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findById(claimId: string) {
    const record = await this.db.placeClaim.findUnique({
      where: { id: claimId },
    });
    return record ? toPlaceClaimEntity(record) : null;
  }

  public async findPendingClaimForPlaceAndUser(placeId: string, userId: string) {
    const record = await this.db.placeClaim.findFirst({
      where: {
        placeId,
        claimantUserId: userId,
        status: {
          in: ["PENDING", "UNDER_REVIEW"],
        },
      },
      orderBy: { submittedAt: "desc" },
    });
    return record ? toPlaceClaimEntity(record) : null;
  }

  public async save(claim: PlaceClaim): Promise<void> {
    const data = toPlaceClaimPersistence(claim);
    const proofReferences = data.proofReferences as unknown as Prisma.InputJsonValue;

    await this.db.placeClaim.upsert({
      where: { id: data.id },
      update: {
        proofReferences,
        status: data.status,
        reviewedAt: data.reviewedAt,
        reviewedByUserId: data.reviewedByUserId,
        reviewNotes: data.reviewNotes,
        updatedAt: data.updatedAt,
      },
      create: {
        ...data,
        proofReferences,
      },
    });
  }
}
