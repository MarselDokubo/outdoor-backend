import { Prisma } from "../../../generated/prisma/client.js";
import type {
  HotspotQueryRow,
  HotspotQueryService,
  NearbyHotspotQueryInput,
  PlaceHotspotQueryInput,
} from "../../../application/discovery/use-cases/query-services.js";
import type { HotspotWindow } from "../../../application/discovery/contracts.js";
import type { DiscoveryPrismaClient } from "./discovery-prisma.types.js";

interface RawHotspotRow {
  placeId: string;
  slug: string;
  name: string;
  categoryCode: string;
  latitude: number;
  longitude: number;
  distanceMeters: number | null;
  visitCount: bigint | number;
  reactionCount: bigint | number;
  commentCount: bigint | number;
  saveCount: bigint | number;
  impressionCount: bigint | number;
  followCount: bigint | number;
  activeEventCount: bigint | number;
  recentPostCount: bigint | number;
  lastSignalAt: Date | null;
}

export class PrismaHotspotQueryService implements HotspotQueryService {
  constructor(private readonly prisma: DiscoveryPrismaClient) {}

  public async findNearbyPlaceSignals(input: NearbyHotspotQueryInput): Promise<HotspotQueryRow[]> {
    const { since, recentPostsSince, upcomingEventsUntil } = resolveWindowDates(input.window);
    const box = boundingBox(input.latitude, input.longitude, input.radiusMeters);

    const rows = await this.prisma.$queryRaw<RawHotspotRow[]>(
      Prisma.sql`
        SELECT
          p.id AS "placeId",
          p.slug AS "slug",
          p.name AS "name",
          p."categoryCode" AS "categoryCode",
          p.latitude AS "latitude",
          p.longitude AS "longitude",
          (
            6371000 * acos(
              LEAST(
                1,
                GREATEST(
                  -1,
                  cos(radians(${input.latitude})) * cos(radians(p.latitude)) *
                  cos(radians(p.longitude) - radians(${input.longitude})) +
                  sin(radians(${input.latitude})) * sin(radians(p.latitude))
                )
              )
            )
          ) AS "distanceMeters",
          COALESCE(v.visit_count, 0) AS "visitCount",
          COALESCE(r.reaction_count, 0) AS "reactionCount",
          COALESCE(c.comment_count, 0) AS "commentCount",
          COALESCE(s.save_count, 0) AS "saveCount",
          COALESCE(i.impression_count, 0) AS "impressionCount",
          COALESCE(f.follow_count, 0) AS "followCount",
          COALESCE(e.event_count, 0) AS "activeEventCount",
          COALESCE(po.post_count, 0) AS "recentPostCount",
          GREATEST(
            COALESCE(v.last_visit_at, to_timestamp(0)),
            COALESCE(r.last_reaction_at, to_timestamp(0)),
            COALESCE(c.last_comment_at, to_timestamp(0)),
            COALESCE(s.last_save_at, to_timestamp(0)),
            COALESCE(i.last_impression_at, to_timestamp(0)),
            COALESCE(f.last_follow_at, to_timestamp(0)),
            COALESCE(e.last_event_at, to_timestamp(0)),
            COALESCE(po.last_post_at, to_timestamp(0))
          ) AS "lastSignalAt"
        FROM "Place" p
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS visit_count,
            MAX(v."startedAt") AS last_visit_at
          FROM "Visit" v
          WHERE v."placeId" = p.id
            AND v.status IN ('ACTIVE', 'COMPLETED')
            AND v."startedAt" >= ${since}
        ) v ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS reaction_count,
            MAX(rn."createdAt") AS last_reaction_at
          FROM "Reaction" rn
          WHERE rn."targetType" = 'PLACE'
            AND rn."targetId" = p.id
            AND rn."createdAt" >= ${since}
        ) r ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS comment_count,
            MAX(cm."createdAt") AS last_comment_at
          FROM "Comment" cm
          WHERE cm."targetType" = 'PLACE'
            AND cm."targetId" = p.id
            AND cm.status = 'ACTIVE'
            AND cm."createdAt" >= ${since}
        ) c ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS save_count,
            MAX(sa."createdAt") AS last_save_at
          FROM "Save" sa
          WHERE sa."targetType" = 'PLACE'
            AND sa."targetId" = p.id
            AND sa."createdAt" >= ${since}
        ) s ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS impression_count,
            MAX(im."occurredAt") AS last_impression_at
          FROM "Impression" im
          WHERE im."targetType" = 'PLACE'
            AND im."targetId" = p.id
            AND im."occurredAt" >= ${since}
        ) i ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS follow_count,
            MAX(fl."createdAt") AS last_follow_at
          FROM "Follow" fl
          WHERE fl."targetType" = 'PLACE'
            AND fl."targetId" = p.id
            AND fl."createdAt" >= ${since}
        ) f ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS event_count,
            MAX(ev."startsAt") AS last_event_at
          FROM "Event" ev
          WHERE ev."placeId" = p.id
            AND ev.status = 'PUBLISHED'
            AND ev."startsAt" <= ${upcomingEventsUntil}
            AND ev."endsAt" >= ${since}
        ) e ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS post_count,
            MAX(po2."createdAt") AS last_post_at
          FROM "Post" po2
          WHERE po2."placeId" = p.id
            AND po2."publicationStatus" = 'PUBLISHED'
            AND po2."createdAt" >= ${recentPostsSince}
        ) po ON TRUE
        WHERE p."publicationStatus" = 'PUBLISHED'
          AND p.visibility = 'PUBLIC'
          AND p.latitude BETWEEN ${box.minLatitude} AND ${box.maxLatitude}
          AND p.longitude BETWEEN ${box.minLongitude} AND ${box.maxLongitude}
          AND (
            6371000 * acos(
              LEAST(
                1,
                GREATEST(
                  -1,
                  cos(radians(${input.latitude})) * cos(radians(p.latitude)) *
                  cos(radians(p.longitude) - radians(${input.longitude})) +
                  sin(radians(${input.latitude})) * sin(radians(p.latitude))
                )
              )
            )
          ) <= ${input.radiusMeters}
        ORDER BY "distanceMeters" ASC
        LIMIT ${input.limit}
      `,
    );

    return rows.map(mapRow);
  }

  public async findPlaceSignals(input: PlaceHotspotQueryInput): Promise<HotspotQueryRow | null> {
    const { since, recentPostsSince, upcomingEventsUntil } = resolveWindowDates(input.window);

    const rows = await this.prisma.$queryRaw<RawHotspotRow[]>(
      Prisma.sql`
        SELECT
          p.id AS "placeId",
          p.slug AS "slug",
          p.name AS "name",
          p."categoryCode" AS "categoryCode",
          p.latitude AS "latitude",
          p.longitude AS "longitude",
          NULL::double precision AS "distanceMeters",
          COALESCE(v.visit_count, 0) AS "visitCount",
          COALESCE(r.reaction_count, 0) AS "reactionCount",
          COALESCE(c.comment_count, 0) AS "commentCount",
          COALESCE(s.save_count, 0) AS "saveCount",
          COALESCE(i.impression_count, 0) AS "impressionCount",
          COALESCE(f.follow_count, 0) AS "followCount",
          COALESCE(e.event_count, 0) AS "activeEventCount",
          COALESCE(po.post_count, 0) AS "recentPostCount",
          GREATEST(
            COALESCE(v.last_visit_at, to_timestamp(0)),
            COALESCE(r.last_reaction_at, to_timestamp(0)),
            COALESCE(c.last_comment_at, to_timestamp(0)),
            COALESCE(s.last_save_at, to_timestamp(0)),
            COALESCE(i.last_impression_at, to_timestamp(0)),
            COALESCE(f.last_follow_at, to_timestamp(0)),
            COALESCE(e.last_event_at, to_timestamp(0)),
            COALESCE(po.last_post_at, to_timestamp(0))
          ) AS "lastSignalAt"
        FROM "Place" p
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS visit_count,
            MAX(v."startedAt") AS last_visit_at
          FROM "Visit" v
          WHERE v."placeId" = p.id
            AND v.status IN ('ACTIVE', 'COMPLETED')
            AND v."startedAt" >= ${since}
        ) v ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS reaction_count,
            MAX(rn."createdAt") AS last_reaction_at
          FROM "Reaction" rn
          WHERE rn."targetType" = 'PLACE'
            AND rn."targetId" = p.id
            AND rn."createdAt" >= ${since}
        ) r ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS comment_count,
            MAX(cm."createdAt") AS last_comment_at
          FROM "Comment" cm
          WHERE cm."targetType" = 'PLACE'
            AND cm."targetId" = p.id
            AND cm.status = 'ACTIVE'
            AND cm."createdAt" >= ${since}
        ) c ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS save_count,
            MAX(sa."createdAt") AS last_save_at
          FROM "Save" sa
          WHERE sa."targetType" = 'PLACE'
            AND sa."targetId" = p.id
            AND sa."createdAt" >= ${since}
        ) s ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS impression_count,
            MAX(im."occurredAt") AS last_impression_at
          FROM "Impression" im
          WHERE im."targetType" = 'PLACE'
            AND im."targetId" = p.id
            AND im."occurredAt" >= ${since}
        ) i ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS follow_count,
            MAX(fl."createdAt") AS last_follow_at
          FROM "Follow" fl
          WHERE fl."targetType" = 'PLACE'
            AND fl."targetId" = p.id
            AND fl."createdAt" >= ${since}
        ) f ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS event_count,
            MAX(ev."startsAt") AS last_event_at
          FROM "Event" ev
          WHERE ev."placeId" = p.id
            AND ev.status = 'PUBLISHED'
            AND ev."startsAt" <= ${upcomingEventsUntil}
            AND ev."endsAt" >= ${since}
        ) e ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::bigint AS post_count,
            MAX(po2."createdAt") AS last_post_at
          FROM "Post" po2
          WHERE po2."placeId" = p.id
            AND po2."publicationStatus" = 'PUBLISHED'
            AND po2."createdAt" >= ${recentPostsSince}
        ) po ON TRUE
        WHERE p.id = ${input.placeId}
          AND p."publicationStatus" = 'PUBLISHED'
          AND p.visibility = 'PUBLIC'
      `,
    );

    const row = rows[0];
    return row ? mapRow(row) : null;
  }
}

function mapRow(row: RawHotspotRow): HotspotQueryRow {
  const lastSignalAt = row.lastSignalAt && row.lastSignalAt.getTime() > 0 ? row.lastSignalAt : null;

  return {
    placeId: row.placeId,
    slug: row.slug,
    name: row.name,
    categoryCode: row.categoryCode,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    distanceMeters: row.distanceMeters === null ? null : Number(row.distanceMeters),
    visitCount: toInt(row.visitCount),
    reactionCount: toInt(row.reactionCount),
    commentCount: toInt(row.commentCount),
    saveCount: toInt(row.saveCount),
    impressionCount: toInt(row.impressionCount),
    followCount: toInt(row.followCount),
    activeEventCount: toInt(row.activeEventCount),
    recentPostCount: toInt(row.recentPostCount),
    lastSignalAt,
  };
}

function toInt(value: bigint | number): number {
  return typeof value === "bigint" ? Number(value) : value;
}

function resolveWindowDates(window: HotspotWindow): {
  since: Date;
  recentPostsSince: Date;
  upcomingEventsUntil: Date;
} {
  const now = new Date();

  if (window === "LIVE_3H") {
    return {
      since: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      recentPostsSince: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      upcomingEventsUntil: new Date(now.getTime() + 12 * 60 * 60 * 1000),
    };
  }

  return {
    since: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    recentPostsSince: new Date(now.getTime() - 72 * 60 * 60 * 1000),
    upcomingEventsUntil: new Date(now.getTime() + 72 * 60 * 60 * 1000),
  };
}

function boundingBox(latitude: number, longitude: number, radiusMeters: number) {
  const earthRadiusMeters = 6371000;
  const latDelta = (radiusMeters / earthRadiusMeters) * (180 / Math.PI);
  const lngDelta =
    ((radiusMeters / earthRadiusMeters) * (180 / Math.PI)) /
    Math.max(Math.cos((latitude * Math.PI) / 180), 0.01);

  return {
    minLatitude: latitude - latDelta,
    maxLatitude: latitude + latDelta,
    minLongitude: longitude - lngDelta,
    maxLongitude: longitude + lngDelta,
  };
}
