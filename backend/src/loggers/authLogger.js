const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const path = require("path");

// Ensure the logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define logger configuration
const authLogger = createLogger({
  level: "info",
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
    }),
  ],
});

// Middleware to log authentication-related actions
const logAuthActivity = (req, res, next) => {
  authLogger.info({
    message: "Authentication Attempt",
    method: req.method,
    endpoint: req.originalUrl,
    ip: req.ip,
    userEmail: req.body?.email || "N/A",
  });
  next();
};

module.exports = { authLogger, logAuthActivity };
