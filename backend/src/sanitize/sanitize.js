const sanitizeHtml = require("sanitize-html");
const { body, param, validationResult } = require("express-validator");

// Generic sanitization middleware for any fields
const sanitizeMiddleware = (fields) => [
  ...fields.map((field) => body(field).trim().escape()),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Deeply sanitize all string fields in the request body (handles nested objects)
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          obj[key] = sanitizeHtml(obj[key], {
            allowedTags: [],
            allowedAttributes: {},
          });
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          sanitizeObject(obj[key]); // Recursive sanitization
        }
      }
    };

    sanitizeObject(req.body);
    next();
  },
];

// Authentication-related sanitization rules
const emailSanitization = [
  body("email")
    .normalizeEmail()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .escape(),
];

const passwordSanitization = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter (A-Z)")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter (a-z)")
    .matches(/\d/)
    .withMessage("Password must contain at least one number (0-9)")
    .trim(),
];

// Inventory management sanitization rules
const productIdSanitization = [
  param("id")
    .trim()
    .escape()
    .matches(/^[a-fA-F0-9]{24}$/)
    .withMessage("Invalid product ID format"),
];

const searchQuerySanitization = [body("search").optional().trim().escape()];

const paginationSanitization = [
  body("pageNo")
    .optional()
    .trim()
    .escape()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Page number must be a positive integer"),
  body("pageSize")
    .optional()
    .trim()
    .escape()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage("Page size must be between 1 and 100"),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Combine multiple sanitization rules
const combineSanitization = (...rules) => {
  return [...rules.flat(), handleValidationErrors];
};

module.exports = {
  sanitizeMiddleware,
  emailSanitization,
  passwordSanitization,
  productIdSanitization,
  searchQuerySanitization,
  paginationSanitization,
  handleValidationErrors,
  combineSanitization,
};
