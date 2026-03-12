import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import { ValidationError } from "../../../shared/errors/app-error";

type ValidationSchemas = {
	body?: ZodTypeAny;
	params?: ZodTypeAny;
	query?: ZodTypeAny;
};

export function validate(schemas: ValidationSchemas) {
	return (req: Request, res: Response, next: NextFunction): void => {
		try {
			const validated: {
				body?: unknown;
				params?: unknown;
				query?: unknown;
			} = {};

			if (schemas.body) {
				validated.body = schemas.body.parse(req.body);
			}

			if (schemas.params) {
				validated.params = schemas.params.parse(req.params);
			}

			if (schemas.query) {
				validated.query = schemas.query.parse(req.query);
			}

			res.locals.validated = validated;

			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const details = error.issues.map((issue) => ({
					path: issue.path.join("."),
					message: issue.message,
					code: issue.code,
				}));

				next(new ValidationError("Request validation failed", details));
				return;
			}

			next(error);
		}
	};
}
