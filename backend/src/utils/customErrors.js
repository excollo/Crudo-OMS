const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
  UNPROCESSABLE: 422,
  RATE_LIMIT: 429,
};

class BaseCustomError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        name: this.name,
        message: this.message,
        code: this.errorCode,
        timestamp: this.timestamp,
      },
    };
  }
}

// Generic Error Classes
class BadRequestError extends BaseCustomError {
  constructor(message = "Bad Request", errorCode = "BAD_REQUEST_ERROR") {
    super(message, HTTP_STATUS_CODES.BAD_REQUEST, errorCode);
  }
}

class ValidationError extends BaseCustomError {
  constructor(validationErrors, message = "Validation Failed") {
    super(message, HTTP_STATUS_CODES.UNPROCESSABLE, "VALIDATION_ERROR");
    this.validationErrors = validationErrors;
  }

  toJSON() {
    return { ...super.toJSON(), validationErrors: this.validationErrors };
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}


class ForbiddenError extends BaseCustomError {
  constructor(message = "Forbidden Access", errorCode = "FORBIDDEN_ERROR") {
    super(message, HTTP_STATUS_CODES.FORBIDDEN, errorCode);
  }
}

class NotFoundError extends BaseCustomError {
  constructor(resourceName = "Resource", errorCode = "NOT_FOUND_ERROR") {
    super(`${resourceName} not found`, HTTP_STATUS_CODES.NOT_FOUND, errorCode);
  }
}

class ConflictError extends BaseCustomError {
  constructor(message = "Resource Conflict", errorCode = "CONFLICT_ERROR") {
    super(message, HTTP_STATUS_CODES.CONFLICT, errorCode);
  }
}

class InternalServerError extends BaseCustomError {
  constructor(
    message = "Internal Server Error",
    errorCode = "INTERNAL_SERVER_ERROR"
  ) {
    super(message, HTTP_STATUS_CODES.INTERNAL_SERVER, errorCode);
  }
}

class AuthenticationError extends BaseCustomError {
  constructor(
    message = "Authentication Failed",
    errorCode = "AUTHENTICATION_ERROR"
  ) {
    super(message, HTTP_STATUS_CODES.UNAUTHORIZED, errorCode);
  }
}

class RateLimitError extends BaseCustomError {
  constructor(message = "Too Many Requests", errorCode = "RATE_LIMIT_ERROR") {
    super(message, HTTP_STATUS_CODES.RATE_LIMIT, errorCode);
  }
}

// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.name}: ${err.message}`, {
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  const responseError =
    err instanceof BaseCustomError ? err : new InternalServerError();
  res.status(responseError.statusCode).json(responseError.toJSON());
};

module.exports = {
  // Error Classes
  BaseCustomError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  AuthenticationError,
  RateLimitError,

  // Middleware
  errorHandler,

  // HTTP Status Codes (for reference)
  HTTP_STATUS_CODES,
};
