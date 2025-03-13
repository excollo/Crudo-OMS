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

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
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
  // Customer validations
  body("customer.customerId")
    .isInt()
    .withMessage("Customer ID must be an integer"),
  body("customer.name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("customer.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email"),
  body("customer.phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Invalid phone number"),
  body("customer.address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),
  body("customer.age").isInt({ min: 0, max: 120 }).withMessage("Invalid age"),
  body("customer.sex")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),
  body("customer.abhanumber")
    .optional()
    .matches(/^[0-9]{14}$/)
    .withMessage("ABHA number must be 14 digits"),

  // Products validations
  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required"),
  body("products.*.productId")
    .isInt()
    .withMessage("Product ID must be an integer"),
  body("products.*.name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters"),
  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("products.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),

  // Payment validations
  body("payment.method")
    .isIn(["COD", "UPI"])
    .withMessage("Invalid payment method"),

  // Pricing validations - Make them optional since they're calculated
  body("pricing.discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount cannot be negative"),

  // SwilERP validations
  body("swilSeriesId")
    .isInt()
    .withMessage("SwilERP Series ID must be an integer"),
];

const customerSanitization = [
  body("Alias")
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage("Alias must be at least 2 characters long")
    .notEmpty()
    .withMessage("Alias is required"),

  body("Customer")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .notEmpty()
    .withMessage("Name is required"),

  body("Email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),

  body("Mobile")
    .trim()
    .escape()
    .isLength({ min: 10, max: 15 })
    .withMessage("Mobile number must be between 10 and 15 characters")
    .matches(/^[0-9]+$/)
    .withMessage("Mobile number must contain only digits")
    .notEmpty()
    .withMessage("Mobile number is required"),

  body("Address").trim().escape().notEmpty().withMessage("Address is required"),

  body("Pincode")
    .trim()
    .escape()
    .matches(/^[0-9]{6}$/)
    .withMessage("Invalid pincode format")
    .notEmpty()
    .withMessage("Pincode is required"),

  body("Gstno")
    .optional()
    .trim()
    .escape()
    .matches(/^[0-9A-Z]{15}$/)
    .withMessage("Invalid GST number format"),

  body("PanNo")
    .optional()
    .trim()
    .escape()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage("Invalid PAN number format"),

  body("Station").optional().trim().escape(),

  body("Druglicence").optional().trim().escape(),
];

const customerUpdateSanitization = [
  param("id").isInt().withMessage("Invalid customer ID format"),

  // Fix Customer validation
  body("Customer")
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage(
      "Customer name is required and must be at least 3 characters long"
    ),

  // Fix Alias validation - added isLength check
  body("Alias")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("If provided, alias cannot be empty"),

  // Other optional fields
  body("Address").optional().trim().escape(),

  body("Druglicence").optional().trim().escape(),

  body("Email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("Gstno")
    .optional()
    .trim()
    .escape()
    .matches(/^[0-9A-Z]{15}$/)
    .withMessage("Invalid GST number format"),

  body("Mobile")
    .optional()
    .trim()
    .escape()
    .matches(/^[0-9]{10}$/)
    .withMessage("Invalid mobile number format"),

  body("PanNo")
    .optional()
    .trim()
    .escape()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage("Invalid PAN number format"),

  body("Pincode")
    .optional()
    .trim()
    .escape()
    .matches(/^[0-9]{6}$/)
    .withMessage("Invalid pincode format"),

  body("Station").optional().trim().escape(),
];

const pdfGenerationSanitization = [
  // Order validation
  body("swilOrderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .trim()
    .escape(),

  // Customer validations
  body("customer.customerId")
    .notEmpty()
    .withMessage("Customer ID is required")
    .trim()
    .escape(),
  body("customer.name")
    .notEmpty()
    .withMessage("Customer name is required")
    .trim()
    .escape(),
  body("customer.age")
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage("Age must be between 0 and 120"),
  body("customer.sex")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender value"),
  body("customer.mobile")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Invalid mobile number"),
  body("customer.abhaNo")
    .optional()
    .matches(/^[0-9]{14}$/)
    .withMessage("Invalid ABHA number"),
  body("customer.address").optional().trim().escape(),

  // Store validations
  body("store.address").optional().trim().escape(),
  body("store.mobile")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Invalid store mobile number"),

  // Products validation
  body("products")
    .isArray()
    .withMessage("Products must be an array")
    .notEmpty()
    .withMessage("At least one product is required"),
  body("products.*.name")
    .notEmpty()
    .withMessage("Product name is required")
    .trim()
    .escape(),
  body("products.*.dosage").optional().trim().escape(),
  body("products.*.frequency").optional().trim().escape(),
  body("products.*.time").optional().trim().escape(),
  body("products.*.duration").optional().trim().escape(),
  body("products.*.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
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
  orderSanitization,
  customerSanitization,
  customerUpdateSanitization,
  pdfGenerationSanitization,
};
