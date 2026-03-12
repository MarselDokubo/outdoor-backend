import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../../../infrastructure/logging/logger";
import { AppError, ValidationError } from "../../../shared/errors/app-error";
import { sendError } from "../../../shared/http/api-response";

export function errorHandlerMiddleware(
	error: unknown,
	req: Request,
	res: Response,
	_next: NextFunction,
): void {
	const requestLogger = res.locals.logger ?? logger;

	let normalizedError: AppError;

	if (error instanceof AppError) {
		normalizedError = error;
	} else if (error instanceof ZodError) {
		normalizedError = new ValidationError(
			"Request validation failed",
			error.issues.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message,
				code: issue.code,
			})),
		);
	} else {
		normalizedError = new AppError(
			"INTERNAL_SERVER_ERROR",
			500,
			"Internal server error",
		);
	}

	requestLogger.error(
		{
			err: error,
			path: req.originalUrl,
			method: req.method,
			statusCode: normalizedError.statusCode,
			code: normalizedError.code,
		},
		"request failed",
	);

	sendError(res, {
		statusCode: normalizedError.statusCode,
		code: normalizedError.code,
		message: normalizedError.message,
		details: normalizedError.details,
	});
}
