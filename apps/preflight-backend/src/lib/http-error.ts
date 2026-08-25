/**
 * http-error — typed HTTP errors.
 * Why: NotFoundError, ValidationError, etc. for route mapping.
 */

export abstract class HttpError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends HttpError {
  readonly statusCode = 400;
}

export class NotFoundError extends HttpError {
  readonly statusCode = 404;
}

export class NotImplementedError extends HttpError {
  readonly statusCode = 501;
}
