const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config/config");
const { UnauthorizedError } = require("../utils/customErrors");

// Middleware to authenticate JWT token
const authenticate = (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.header("Authorization");
    const token = authHeader?.match(/^Bearer\s(.+)$/)?.[1];

    if (!token) {
      return next(new UnauthorizedError("No token provided"));
    }

    // Verify JWT and attach user payload to the request
    req.user = jwt.verify(token, jwtConfig.secret || process.env.JWT_SECRET);
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid token"));
  }
};

module.exports = { authenticate };
