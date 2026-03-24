export class VisitValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VisitValidationError";
  }
}

export class VisitStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VisitStateError";
  }
}
