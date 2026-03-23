import type { PlaceRepository } from "../../../domain/place/repositories/index.js";
import type { PlaceOwnerMembership } from "../../../domain/place/place-owner-membership.js";
import type { Place } from "../../../domain/place/place.js";
import type {
  PlaceOwnerMembershipStatus,
  PlaceOwnerRole,
} from "../../../domain/place/place.enums.js";
import type { PlacesPrismaClient, PlacesPrismaTransactionClient } from "./place-prisma.types.js";
import { toPlaceEntity, toPlacePersistence } from "./place-mappers.js";

type PrismaDb = PlacesPrismaClient | PlacesPrismaTransactionClient;

interface PlaceOwnerMembershipRecord {
  id: string;
  placeId: string;
  userId: string;
  role: PlaceOwnerRole;
  status: PlaceOwnerMembershipStatus;
  grantedAt: Date;
  grantedByUserId: string;
}

export class PrismaPlaceRepository implements PlaceRepository {
  constructor(private readonly db: PrismaDb) {}

  public async findById(placeId: string) {
    const record = await this.db.place.findUnique({
      where: { id: placeId },
    });
    return record ? toPlaceEntity(record) : null;
  }

  public async findBySlug(slug: string) {
    const record = await this.db.place.findUnique({
      where: { slug },
    });
    return record ? toPlaceEntity(record) : null;
  }

  public async existsSlug(slug: string): Promise<boolean> {
    const count = await this.db.place.count({
      where: { slug },
    });
    return count > 0;
  }

  public async save(place: Place): Promise<void> {
    const data = toPlacePersistence(place);
    await this.db.place.upsert({
      where: { id: data.id },
      update: {
        slug: data.slug,
        name: data.name,
        categoryCode: data.categoryCode,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        phone: data.phone,
        email: data.email,
        website: data.website,
        latitude: data.latitude,
        longitude: data.longitude,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        area: data.area,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        countryCode: data.countryCode,
        formattedAddress: data.formattedAddress,
        publicationStatus: data.publicationStatus,
        visibility: data.visibility,
        sourceType: data.sourceType,
        officialTagline: data.officialTagline,
        officialSummary: data.officialSummary,
        isOwnerManaged: data.isOwnerManaged,
        isVerified: data.isVerified,
        updatedAt: data.updatedAt,
        archivedAt: data.archivedAt,
      },
      create: data,
    });
  }

  public async getActiveMembership(
    placeId: string,
    userId: string,
  ): Promise<PlaceOwnerMembership | null> {
    const record = (await this.db.placeOwnerMembership.findUnique({
      where: {
        placeId_userId: {
          placeId,
          userId,
        },
      },
    })) as PlaceOwnerMembershipRecord | null;

    if (!record || record.status !== "ACTIVE") {
      return null;
    }

    return mapMembership(record);
  }

  public async createOrReplaceMembership(input: {
    id: string;
    placeId: string;
    userId: string;
    role: PlaceOwnerRole;
    grantedByUserId: string;
  }): Promise<PlaceOwnerMembership> {
    const record = (await this.db.placeOwnerMembership.upsert({
      where: {
        placeId_userId: {
          placeId: input.placeId,
          userId: input.userId,
        },
      },
      update: {
        role: input.role,
        status: "ACTIVE",
        grantedAt: new Date(),
        grantedByUserId: input.grantedByUserId,
      },
      create: {
        id: input.id,
        placeId: input.placeId,
        userId: input.userId,
        role: input.role,
        status: "ACTIVE",
        grantedAt: new Date(),
        grantedByUserId: input.grantedByUserId,
      },
    })) as PlaceOwnerMembershipRecord;

    return mapMembership(record);
  }
}

function mapMembership(record: PlaceOwnerMembershipRecord): PlaceOwnerMembership {
  return {
    id: record.id,
    placeId: record.placeId,
    userId: record.userId,
    role: record.role,
    status: record.status,
    grantedAt: record.grantedAt,
    grantedByUserId: record.grantedByUserId,
  };
}
