import { AppError } from "../../shared/errors/app-error.js";

export class EventValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "EVENT_VALIDATION_ERROR", details);
    this.name = "EventValidationError";
  }
}

export class EventAccessDeniedError extends AppError {
  constructor(message = "Access denied to event.") {
    super(message, 403, "EVENT_ACCESS_DENIED");
    this.name = "EventAccessDeniedError";
  }
}

export class EventNotFoundError extends AppError {
  constructor(message = "Event not found.") {
    super(message, 404, "EVENT_NOT_FOUND");
    this.name = "EventNotFoundError";
  }
}
