import type { Request, Response } from "express";
import { HealthService } from "../../../application/services/health.service";

export class HealthController {
	constructor(private readonly healthService: HealthService) { }

	live = (_req: Request, res: Response): void => {
		const result = this.healthService.live(res.locals.logger);
		res.status(200).json(result);
	};

	ready = async (_req: Request, res: Response): Promise<void> => {
		const result = await this.healthService.ready(res.locals.logger);
		const statusCode = result.status === "ok" ? 200 : 503;
		res.status(statusCode).json(result);
	};

	deps = async (_req: Request, res: Response): Promise<void> => {
		const result = await this.healthService.deps(res.locals.logger);
		const statusCode = result.status === "ok" ? 200 : 503;
		res.status(statusCode).json(result);
	};
}
