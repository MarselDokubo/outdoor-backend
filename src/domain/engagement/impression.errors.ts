import { AppError } from "../../shared/errors/app-error.js";

export class ImpressionValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "IMPRESSION_VALIDATION_ERROR", details);
    this.name = "ImpressionValidationError";
  }
}

export class ImpressionAccessDeniedError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "IMPRESSION_ACCESS_DENIED");
    this.name = "ImpressionAccessDeniedError";
  }
}
