export class MediaValidationError extends Error {
  constructor(
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "MediaValidationError";
  }
}

export class MediaConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaConflictError";
  }
}

export class MediaForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaForbiddenError";
  }
}
