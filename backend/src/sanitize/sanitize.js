const { sanitize } = require("sanitize-html");
const xss = require("xss");
const mongoSanitize = require("express-mongo-sanitize");

// Custom sanitization function
const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return xss(sanitize(input, { allowedTags: [], allowedAttributes: {} }));
  } else if (typeof input === "object" && input !== null) {
    Object.keys(input).forEach((key) => {
      input[key] = sanitizeInput(input[key]);
    });
  }
  return input;
};

// Middleware to sanitize request body, params, and query
const sanitizeRequest = (req, res, next) => {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  mongoSanitize.sanitize(req.body); // Prevent NoSQL Injection
  next();
};

module.exports = sanitizeRequest;
