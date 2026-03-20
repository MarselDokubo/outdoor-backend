import type { Request, Response } from "express";
import { sendSuccess } from "../../../shared/http/api-response";
import type { ValidatePointUseCase } from "../../../application/geo/use-cases/validate-point.use-case";
import type { GeocodeAddressUseCase } from "../../../application/geo/use-cases/geocode-address.use-case";
import type { ReverseGeocodePointUseCase } from "../../../application/geo/use-cases/reverse-geocode-point.use-case";
import { logger } from "../../../infrastructure/logging/logger";

type ValidatedGeoPointBody = {
  latitude: number;
  longitude: number;
};

type ValidatedGeocodeBody = {
  query: string;
};

function sendProviderError(res: Response, message = "Geocoding provider unavailable"): void {
  res.status(502).json({
    success: false,
    error: {
      code: "GEO_PROVIDER_ERROR",
      message,
    },
  });
}

export class GeoController {
  constructor(
    private readonly validatePointUseCase: ValidatePointUseCase,
    private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    private readonly reverseGeocodePointUseCase: ReverseGeocodePointUseCase,
  ) {}

  validatePoint = (req: Request, res: Response): void => {
    const requestLogger = res.locals.logger ?? logger;
    const body = (res.locals.validated?.body ?? req.body) as ValidatedGeoPointBody;

    const point = this.validatePointUseCase.execute(Number(body.latitude), Number(body.longitude));

    requestLogger.debug(
      {
        geoOperation: "validate-point",
        latitude: point.latitude,
        longitude: point.longitude,
      },
      "geo point validated",
    );

    sendSuccess(res, { point });
  };

  geocode = async (req: Request, res: Response): Promise<void> => {
    const requestLogger = res.locals.logger ?? logger;
    const body = (res.locals.validated?.body ?? req.body) as ValidatedGeocodeBody;

    try {
      const results = await this.geocodeAddressUseCase.execute(body.query);

      requestLogger.info(
        {
          geoOperation: "geocode",
          query: body.query,
          resultCount: results.length,
        },
        "geo geocode completed",
      );

      sendSuccess(res, { results });
    } catch (error) {
      requestLogger.error(
        {
          err: error,
          geoOperation: "geocode",
          query: body.query,
        },
        "geo geocode failed",
      );

      sendProviderError(res);
    }
  };

  reverseGeocode = async (req: Request, res: Response): Promise<void> => {
    const requestLogger = res.locals.logger ?? logger;
    const body = (res.locals.validated?.body ?? req.body) as ValidatedGeoPointBody;

    try {
      const result = await this.reverseGeocodePointUseCase.execute(
        Number(body.latitude),
        Number(body.longitude),
      );

      requestLogger.info(
        {
          geoOperation: "reverse-geocode",
          latitude: Number(body.latitude),
          longitude: Number(body.longitude),
          matched: Boolean(result),
        },
        "geo reverse geocode completed",
      );

      sendSuccess(res, {
        point: {
          latitude: Number(body.latitude),
          longitude: Number(body.longitude),
        },
        result,
      });
    } catch (error) {
      requestLogger.error(
        {
          err: error,
          geoOperation: "reverse-geocode",
          latitude: Number(body.latitude),
          longitude: Number(body.longitude),
        },
        "geo reverse geocode failed",
      );

      sendProviderError(res);
    }
  };
}
