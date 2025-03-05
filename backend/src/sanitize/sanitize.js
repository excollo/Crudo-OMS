const sanitizeHtml = require("sanitize-html");
const { body, validationResult } = require("express-validator");

const sanitizeMiddleware = (fields) => [
  // Apply sanitization to all fields
  ...fields.map((field) => body(field).trim().escape()),

  // Validate and sanitize request body
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Sanitize all string fields in the request body
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    }
    next();
  },
];

const emailSanitization = [
  body("email").normalizeEmail().isEmail().withMessage("Invalid email address"),
];

const passwordSanitization = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .custom((value) => {
      if (!/[A-Z]/.test(value))
        throw new Error("Password must contain at least one uppercase letter");
      if (!/[a-z]/.test(value))
        throw new Error("Password must contain at least one lowercase letter");
      if (!/\d/.test(value))
        throw new Error("Password must contain at least one number");
      return true;
    }),
];

module.exports = {
  sanitizeMiddleware,
  emailSanitization,
  passwordSanitization,
};
