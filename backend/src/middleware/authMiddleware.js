const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config/config");

// Function to extract and validate token from request headers
const extractToken = (req) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

// Middleware for verifying JWT
const verifyToken = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized - Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Forbidden - Invalid token" });
    } else {
      return res
        .status(500)
        .json({
          error:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Internal Server Error",
        });
    }
  }
};

module.exports = { verifyToken };