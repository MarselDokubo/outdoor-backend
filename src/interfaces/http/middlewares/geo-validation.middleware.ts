import type { NextFunction, Request, Response } from "express";
import { createGeoPoint } from "../../../domain/geo/geo-point";

type ValidatedGeoPointBody = {
  latitude: number;
  longitude: number;
};

type ValidatedGeocodeBody = {
  query: string;
};

function sendBadRequest(res: Response, message: string, details?: Record<string, unknown>): void {
  res.status(400).json({
    success: false,
    error: {
      code: "BAD_REQUEST",
      message,
      ...(details ? { details } : {}),
    },
  });
}

export function validateGeoPointBody(req: Request, res: Response, next: NextFunction): void {
  const { latitude, longitude } = req.body ?? {};

  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
    sendBadRequest(res, "latitude and longitude must be valid numbers");
    return;
  }

  try {
    const point = createGeoPoint(parsedLatitude, parsedLongitude);

    res.locals.validated = {
      ...(res.locals.validated ?? {}),
      body: {
        latitude: point.latitude,
        longitude: point.longitude,
      } satisfies ValidatedGeoPointBody,
    };

    next();
  } catch (error) {
    sendBadRequest(res, "Invalid geo point", {
      reason: error instanceof Error ? error.message : "Unknown validation error",
    });
  }
}

export function validateGeocodeBody(req: Request, res: Response, next: NextFunction): void {
  const rawQuery = req.body?.query;

  if (typeof rawQuery !== "string") {
    sendBadRequest(res, "query must be a string");
    return;
  }

  const query = rawQuery.trim();

  if (!query) {
    sendBadRequest(res, "query must not be empty");
    return;
  }

  if (query.length > 200) {
    sendBadRequest(res, "query must not exceed 200 characters");
    return;
  }

  res.locals.validated = {
    ...(res.locals.validated ?? {}),
    body: {
      query,
    } satisfies ValidatedGeocodeBody,
  };

  next();
}
