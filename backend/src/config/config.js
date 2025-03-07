require("dotenv").config(); // Load environment variables from .env file

const assertConfig = (key, value) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
};

const config = {
  port: process.env.PORT || 3000, // Default to port 3000 if not provided
  mongoURI: process.env.MONGO_URI, // MongoDB connection string
  jwtConfig: {
    secret: process.env.JWT_SECRET, // JWT access token secret
    refreshSecret: process.env.JWT_REFRESH_SECRET, // JWT refresh token secret
    expiresIn: process.env.JWT_EXPIRES_IN || "15m", // Access token expiry
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d", // Refresh token expiry
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587, // Convert to number, default to 587
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  frontendURL: process.env.FRONTEND_URL, // Frontend application URL
};

// Validate essential environment variables
[
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
].forEach((key) => assertConfig(key, process.env[key]));

module.exports = config;
