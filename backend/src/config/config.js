require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtConfig: {
    secret: process.env.JWT_SECRET || "defaultSecretKey",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  frontendURL: process.env.FRONTEND_URL,
};

console.log("CONFIG LOADED:", config); // ✅ DEBUG LOGGING

module.exports = config;
