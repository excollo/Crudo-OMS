const { validationResult } = require("express-validator");
const {
  BaseCustomError,
  UnauthorizedError, // Import this
  ValidationError: CustomValidationError, // If needed
} = require("./customErrors");

const handleControllerError = (error, req, res, logger) => {
  const errorContext = {
    path: req.path,
    method: req.method,
    params: req.params,
    body: req.body,
    stack: error.stack,
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation error", {
      errors: errors.array(),
      context: errorContext,
    });

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  // Handle other custom errors
  if (
    error instanceof UnauthorizedError || // This should now work
    error.name === "UnauthorizedError"
  ) {
    logger.warn(`Unauthorized: ${error.message}`, errorContext);

    return res.status(error.statusCode || 401).json({
      success: false,
      message: "Unauthorized",
      error: error.message,
    });
  }

  if (error instanceof BaseCustomError) {
    logger.error(`[${error.name}] ${error.message}`, errorContext);
    return res.status(error.statusCode).json(error.toJSON());
  }

  logger.error(`Unhandled Server Error: ${error.message}`, errorContext);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

module.exports = {
  handleControllerError,
};
