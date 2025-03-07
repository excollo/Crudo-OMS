const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const path = require("path");

// Set up log directory and file path
const logDir = path.join(__dirname, "../logs");
const logFilePath = path.join(logDir, "auth.log");
fs.mkdirSync(logDir, { recursive: true }); // Ensure logs directory exists

// Log formats
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.json()
);

const consoleFormat = format.combine(
  format.colorize(),
  format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
  )
);

// Logger instance
const appLogger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({
      filename: logFilePath,
      maxsize: 5 * 1024 * 1024, // 5MB per file
      maxFiles: 5, // Retain last 5 log files
      tailable: true,
      zippedArchive: true, // Compress old logs
    }),
  ],
});

// Middleware to log authentication attempts
const logActivity = (req, res, next) => {
  appLogger.info({
    message: "Authentication Attempt",
    method: req.method,
    endpoint: req.originalUrl,
    ip: req.ip,
    userEmail: req.body?.email ?? "N/A",
  });
  next();
};

module.exports = { appLogger, logActivity };
