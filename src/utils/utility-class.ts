export class ErrorHandler extends Error {
  constructor(public message: string, public code: number) {
    super(message);
    this.code = code;
  }
}

export class AuthenticationError extends ErrorHandler {
  constructor(public message: string) {
    super(message, 401);
  }
}

export class ValidationError extends ErrorHandler {
  constructor(public message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends ErrorHandler {
  constructor(public message: string) {
    super(message, 404);
  }
}
