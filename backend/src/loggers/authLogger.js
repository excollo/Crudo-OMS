const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const path = require("path");

// Define log directory and file path
const logDir = path.join(__dirname, "../logs");
const logFilePath = path.join(logDir, "auth.log");

// Ensure the logs directory exists
fs.mkdirSync(logDir, { recursive: true });

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.json()
);

// Console-friendly format
const consoleFormat = format.combine(
  format.colorize(),
  format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
  )
);

// Create logger instance
const authLogger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({
      filename: logFilePath,
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
    userEmail: req.body?.email ?? "N/A",
  });
  next();
};

module.exports = { authLogger, logAuthActivity };
