import type { Request, Response } from "express";
import { sendSuccess } from "../../../shared/http/api-response";
import type { ValidatePointUseCase } from "../../../application/geo/use-cases/validate-point.use-case";
import type { GeocodeAddressUseCase } from "../../../application/geo/use-cases/geocode-address.use-case";
import type { ReverseGeocodePointUseCase } from "../../../application/geo/use-cases/reverse-geocode-point.use-case";

export class GeoController {
  constructor(
    private readonly validatePointUseCase: ValidatePointUseCase,
    private readonly geocodeAddressUseCase: GeocodeAddressUseCase,
    private readonly reverseGeocodePointUseCase: ReverseGeocodePointUseCase,
  ) {}

  validatePoint = (req: Request, res: Response): void => {
    const { latitude, longitude } = req.body as {
      latitude: number;
      longitude: number;
    };

    const point = this.validatePointUseCase.execute(Number(latitude), Number(longitude));

    sendSuccess(res, { point });
  };

  geocode = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.body as { query: string };
    const results = await this.geocodeAddressUseCase.execute(String(query));
    sendSuccess(res, { results });
  };

  reverseGeocode = async (req: Request, res: Response): Promise<void> => {
    const { latitude, longitude } = req.body as {
      latitude: number;
      longitude: number;
    };

    const result = await this.reverseGeocodePointUseCase.execute(
      Number(latitude),
      Number(longitude),
    );

    sendSuccess(res, {
      point: { latitude: Number(latitude), longitude: Number(longitude) },
      result,
    });
  };
}
