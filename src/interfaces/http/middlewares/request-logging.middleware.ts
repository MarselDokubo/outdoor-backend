import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../../../infrastructure/logging/logger";

export function requestLoggingMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const requestId = randomUUID();
	const startedAt = Date.now();

	res.locals.requestId = requestId;
	res.locals.logger = logger.child({
		requestId,
		method: req.method,
		path: req.originalUrl,
	});

	res.locals.logger.info("request received");

	res.on("finish", () => {
		const durationMs = Date.now() - startedAt;

		res.locals.logger.info(
			{
				statusCode: res.statusCode,
				durationMs,
			},
			"request completed",
		);
	});

	next();
}
