export class AppError extends Error {
	constructor(
		public readonly code: string,
		public readonly statusCode: number,
		message: string,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export class ValidationError extends AppError {
	constructor(message = "Request validation failed", details?: unknown) {
		super("VALIDATION_ERROR", 400, message, details);
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Resource not found", details?: unknown) {
		super("NOT_FOUND", 404, message, details);
	}
}

export class ConflictError extends AppError {
	constructor(message = "Resource conflict", details?: unknown) {
		super("CONFLICT", 409, message, details);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized", details?: unknown) {
		super("UNAUTHORIZED", 401, message, details);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = "Forbidden", details?: unknown) {
		super("FORBIDDEN", 403, message, details);
	}
}
