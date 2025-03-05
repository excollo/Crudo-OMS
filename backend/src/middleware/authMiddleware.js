const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config/config");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.match(/^Bearer\s(.+)$/)?.[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    req.user = jwt.verify(token, jwtConfig.secret || process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).json({ error: "Forbidden: Invalid or expired token" });
  }
};

module.exports = { verifyToken };