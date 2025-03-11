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

// Order sanitization rules
const orderSanitization = [

  // Customer validation
  body("customer.customerId")
    .isInt({ min: 1 })
    .withMessage("Customer ID must be a positive integer"),

  body("customer.name")
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("customer.email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("customer.phone")
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone must be 10 digits"),

  body("customer.address")
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),

  body("customer.age")
    .isInt({ min: 0, max: 120 })
    .withMessage("Age must be between 0 and 120"),

  body("customer.sex")
    .trim()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender value"),

  body("customer.abhanumber")
    .optional({ nullable: true })
    .trim()
    .matches(/^\d{14}$/)
    .withMessage("ABHA number must be 14 digits"),

  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required"),

  body("products.*.productId")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer"),

  body("products.*.name")
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters"),

  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("products.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price must be non-negative"),

  // Payment validation - stricter enum check
  body("payment.method")
    .trim()
    .isIn(["COD", "UPI"])
    .withMessage("Payment method must be either COD or UPI"),

  // Pricing validation - make required fields mandatory
  body("pricing.subtotal")
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("Subtotal is required and cannot be negative"),

  body("pricing.discount")
    .default(0)
    .isFloat({ min: 0 })
    .withMessage("Discount cannot be negative")
    .custom((value, { req }) => {
      if (value > req.body.pricing?.subtotal) {
        throw new Error("Discount cannot be greater than subtotal");
      }
      return true;
    }),

  body("pricing.totalAmount")
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("Total amount is required and cannot be negative")
    .custom((value, { req }) => {
      const subtotal = req.body.pricing?.subtotal || 0;
      const discount = req.body.pricing?.discount || 0;
      if (value !== subtotal - discount) {
        throw new Error("Total amount must equal subtotal minus discount");
      }
      return true;
    }),
];

module.exports = {
  sanitizeMiddleware,
  emailSanitization,
  passwordSanitization,
  productIdSanitization,
  searchQuerySanitization,
  paginationSanitization,
  handleValidationErrors,
  combineSanitization,
  orderSanitization
};
