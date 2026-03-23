import { Prisma } from "../../../generated/prisma/client.js";
import { ForbiddenError } from "../../../shared/errors/app-error.js";
import { isStaffActor } from "../../../domain/place/place-actor.js";
import type {
  ListPendingClaimsQuery,
  PendingPlaceClaimView,
  PlaceDetailsView,
  PlaceMarkerView,
  SearchPlacesQuery,
  SearchPlacesResult,
  NearbyPlacesQuery,
  TaggingPlacesQuery,
} from "../../../application/place/contracts.js";
import type { OwnershipProofInput } from "../../../application/place/contracts.js";
import type { PlaceQueryService } from "../../../application/place/use-cases/query-services.js";
import type { PlacesPrismaClient } from "./place-prisma.types.js";

interface PlaceRecord {
  id: string;
  slug: string;
  name: string;
  categoryCode: string;
  shortDescription: string | null;
  fullDescription: string | null;
  officialTagline: string | null;
  officialSummary: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number;
  longitude: number;
  addressLine1: string | null;
  addressLine2: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  countryCode: string;
  formattedAddress: string | null;
  publicationStatus: string;
  visibility: string;
  isOwnerManaged: boolean;
  isVerified: boolean;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MembershipWithPlaceRecord {
  place: PlaceRecord;
}

interface ClaimWithPlaceRecord {
  id: string;
  placeId: string;
  claimantUserId: string;
  status: string;
  submittedAt: Date;
  proofReferences: unknown;
  place: {
    name: string;
  };
}

interface NearbyRow {
  id: string;
  slug: string;
  name: string;
  categorycode: string;
  latitude: number;
  longitude: number;
  visibility: string;
  isverified: boolean;
  distance_meters: number;
}

export class PrismaPlaceQueryService implements PlaceQueryService {
  constructor(private readonly prisma: PlacesPrismaClient) {}

  public async getPlaceDetailsById(placeId: string): Promise<PlaceDetailsView | null> {
    const record = (await this.prisma.place.findUnique({
      where: { id: placeId },
    })) as PlaceRecord | null;
    return record ? mapPlaceDetails(record) : null;
  }

  public async getPlaceDetailsBySlug(slug: string): Promise<PlaceDetailsView | null> {
    const record = (await this.prisma.place.findUnique({
      where: { slug },
    })) as PlaceRecord | null;
    return record ? mapPlaceDetails(record) : null;
  }

  public async searchPlaces(query: SearchPlacesQuery): Promise<SearchPlacesResult> {
    const limit = clamp(query.limit ?? 20, 1, 100);
    const cursor = decodeCursor(query.cursor);

    const andWhere: Prisma.PlaceWhereInput[] = [
      {
        publicationStatus: "PUBLISHED",
        visibility: "PUBLIC",
      },
    ];

    if (query.q) {
      andWhere.push({
        OR: [
          { name: { contains: query.q, mode: "insensitive" } },
          { shortDescription: { contains: query.q, mode: "insensitive" } },
          { fullDescription: { contains: query.q, mode: "insensitive" } },
          { city: { contains: query.q, mode: "insensitive" } },
          { area: { contains: query.q, mode: "insensitive" } },
        ],
      });
    }

    if (query.category) {
      andWhere.push({ categoryCode: query.category.toUpperCase() });
    }

    if (cursor) {
      andWhere.push({
        OR: [
          { name: { gt: cursor.name } },
          { AND: [{ name: cursor.name }, { id: { gt: cursor.id } }] },
        ],
      });
    }

    const records = (await this.prisma.place.findMany({
      where: { AND: andWhere },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      take: limit + 1,
    })) as PlaceRecord[];

    const hasMore = records.length > limit;
    const page = hasMore ? records.slice(0, limit) : records;
    const last = page.at(-1);

    return {
      items: page.map((record: PlaceRecord) => ({
        id: record.id,
        slug: record.slug,
        name: record.name,
        category: record.categoryCode,
        latitude: record.latitude,
        longitude: record.longitude,
        visibility: record.visibility,
        isVerified: record.isVerified,
      })),
      nextCursor: hasMore && last ? encodeCursor({ id: last.id, name: last.name }) : null,
    };
  }

  public async findNearbyPlaces(query: NearbyPlacesQuery): Promise<PlaceMarkerView[]> {
    const limit = clamp(query.limit ?? 25, 1, 100);
    const radiusMeters = clamp(query.radiusMeters, 50, 50_000);

    const latitude = query.latitude;
    const longitude = query.longitude;
    const latDelta = radiusMeters / 111_320;
    const lngDelta = radiusMeters / (111_320 * Math.cos((latitude * Math.PI) / 180));

    const visibilitySql = isStaffActor(query.actor)
      ? Prisma.sql``
      : Prisma.sql`AND p."publicationStatus" = 'PUBLISHED' AND p.visibility = 'PUBLIC'`;

    const categorySql = query.category
      ? Prisma.sql`AND p."categoryCode" = ${query.category.toUpperCase()}`
      : Prisma.sql``;

    const rows = (await this.prisma.$queryRaw(Prisma.sql`
      SELECT
        p.id,
        p.slug,
        p.name,
        p."categoryCode" as categorycode,
        p.latitude,
        p.longitude,
        p.visibility,
        p."isVerified" as isverified,
        (
          6371000 * acos(
            LEAST(
              1,
              GREATEST(
                -1,
                cos(radians(${latitude})) * cos(radians(p.latitude)) *
                cos(radians(p.longitude) - radians(${longitude})) +
                sin(radians(${latitude})) * sin(radians(p.latitude))
              )
            )
          )
        ) AS distance_meters
      FROM "Place" p
      WHERE
        p.latitude BETWEEN ${latitude - latDelta} AND ${latitude + latDelta}
        AND p.longitude BETWEEN ${longitude - lngDelta} AND ${longitude + lngDelta}
        ${visibilitySql}
        ${categorySql}
      ORDER BY distance_meters ASC
      LIMIT ${limit * 3}
    `)) as NearbyRow[];

    return rows
      .filter(
        (row: NearbyRow) =>
          Number.isFinite(row.distance_meters) && row.distance_meters <= radiusMeters,
      )
      .slice(0, limit)
      .map((row: NearbyRow) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        category: row.categorycode,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        distanceMeters: Math.round(Number(row.distance_meters)),
        visibility: row.visibility,
        isVerified: row.isverified,
      }));
  }

  public async searchPlacesForTagging(query: TaggingPlacesQuery): Promise<PlaceMarkerView[]> {
    const limit = clamp(query.limit ?? 15, 1, 50);
    const records = (await this.prisma.place.findMany({
      where: {
        AND: [
          { publicationStatus: "PUBLISHED" },
          { OR: [{ visibility: "PUBLIC" }, { visibility: "UNLISTED" }] },
          {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { city: { contains: query.q, mode: "insensitive" } },
              { area: { contains: query.q, mode: "insensitive" } },
            ],
          },
        ],
      },
      orderBy: [{ isVerified: "desc" }, { name: "asc" }],
      take: limit,
    })) as PlaceRecord[];

    return records.map((record: PlaceRecord) => ({
      id: record.id,
      slug: record.slug,
      name: record.name,
      category: record.categoryCode,
      latitude: record.latitude,
      longitude: record.longitude,
      visibility: record.visibility,
      isVerified: record.isVerified,
    }));
  }

  public async listMyOwnedPlaces(userId: string): Promise<PlaceMarkerView[]> {
    const memberships = (await this.prisma.placeOwnerMembership.findMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        place: true,
      },
      orderBy: {
        grantedAt: "desc",
      },
    })) as MembershipWithPlaceRecord[];

    return memberships.map(({ place }: MembershipWithPlaceRecord) => ({
      id: place.id,
      slug: place.slug,
      name: place.name,
      category: place.categoryCode,
      latitude: place.latitude,
      longitude: place.longitude,
      visibility: place.visibility,
      isVerified: place.isVerified,
    }));
  }

  public async listPendingClaims(query: ListPendingClaimsQuery): Promise<PendingPlaceClaimView[]> {
    if (!isStaffActor(query.actor)) {
      throw new ForbiddenError("Only staff can view pending claims.");
    }

    const claims = (await this.prisma.placeClaim.findMany({
      where: {
        status: {
          in: ["PENDING", "UNDER_REVIEW"],
        },
      },
      include: {
        place: true,
      },
      orderBy: {
        submittedAt: "asc",
      },
    })) as ClaimWithPlaceRecord[];

    return claims.map((claim: ClaimWithPlaceRecord) => ({
      id: claim.id,
      placeId: claim.placeId,
      placeName: claim.place.name,
      claimantUserId: claim.claimantUserId,
      status: claim.status,
      submittedAt: claim.submittedAt.toISOString(),
      proofReferences: Array.isArray(claim.proofReferences)
        ? (claim.proofReferences as OwnershipProofInput[])
        : [],
    }));
  }
}

function mapPlaceDetails(record: PlaceRecord): PlaceDetailsView {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    category: record.categoryCode,
    shortDescription: record.shortDescription,
    fullDescription: record.fullDescription,
    officialTagline: record.officialTagline,
    officialSummary: record.officialSummary,
    contactDetails: {
      phone: record.phone,
      email: record.email,
      website: record.website,
    },
    location: {
      latitude: record.latitude,
      longitude: record.longitude,
      addressLine1: record.addressLine1,
      addressLine2: record.addressLine2,
      area: record.area,
      city: record.city,
      state: record.state,
      postalCode: record.postalCode,
      countryCode: record.countryCode,
      formattedAddress: record.formattedAddress,
    },
    publicationStatus: record.publicationStatus,
    visibility: record.visibility,
    isOwnerManaged: record.isOwnerManaged,
    isVerified: record.isVerified,
    canCurrentViewerManage: false,
    createdByUserId: record.createdByUserId,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function encodeCursor(payload: { name: string; id: string }): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodeCursor(cursor?: string | undefined): { name: string; id: string } | null {
  if (!cursor) return null;
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
      name: string;
      id: string;
    };
    if (!parsed?.name || !parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}
