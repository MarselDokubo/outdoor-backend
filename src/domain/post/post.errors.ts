import { BadRequestError, ForbiddenError, NotFoundError } from "../../shared/errors/app-error.js";

export class PostValidationError extends BadRequestError {
  constructor(message: string, details?: unknown) {
    super(message, details);
    this.name = "PostValidationError";
  }
}

export class PostForbiddenError extends ForbiddenError {
  constructor(message = "Post action is not allowed.", details?: unknown) {
    super(message, details);
    this.name = "PostForbiddenError";
  }
}

export class PostNotFoundError extends NotFoundError {
  constructor(message = "Post not found.", details?: unknown) {
    super(message, details);
    this.name = "PostNotFoundError";
  }
}

export class PostStateError extends BadRequestError {
  constructor(message: string, details?: unknown) {
    super(message, details);
    this.name = "PostStateError";
  }
}
