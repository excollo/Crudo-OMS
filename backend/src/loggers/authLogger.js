const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const path = require("path");

// Ensure the logs directory exists asynchronously
const logDir = path.join(__dirname, "../logs");
fs.promises.mkdir(logDir, { recursive: true }).catch(console.error);

// Determine log level from environment variable (default: "info")
const logLevel = process.env.LOG_LEVEL || "info";

// Winston logger configuration
const authLogger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({
      filename: path.join(logDir, "auth.log"),
      maxsize: 5 * 1024 * 1024, // 5MB log rotation
      maxFiles: 5, // Keep last 5 logs
      tailable: true, // Rotate logs without breaking the file stream
      zippedArchive: true, // Compress old logs to save space
    }),
  ],
});

// Middleware to log authentication attempts securely
const logAuthActivity = (req, res, next) => {
  try {
    const maskedEmail = req.body?.email
      ? req.body.email.replace(/(.{2}).+(@.+)/, "$1****$2")
      : "N/A"; // Mask email
    const maskedIP = req.ip ? req.ip.replace(/\.\d+$/, ".***") : "N/A"; // Mask last part of IP

    authLogger.info({
      message: "Authentication Attempt",
      method: req.method,
      endpoint: req.originalUrl,
      ip: maskedIP,
      userEmail: maskedEmail,
    });
  } catch (error) {
    authLogger.error(`Logging error: ${error.message}`);
  }
  next();
};

module.exports = { authLogger, logAuthActivity };
