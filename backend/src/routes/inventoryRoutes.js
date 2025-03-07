const express = require("express");
const inventoryController = require("../controllers/inventoryController");
const authMiddleware = require("../middleware/authMiddleware");
const { logActivity } = require("../loggers/appLogger");
const {
  productIdSanitization,
  searchQuerySanitization,
  paginationSanitization,
  combineSanitization,
} = require("../sanitize/sanitize");

const router = express.Router();

// Get list of products with search and pagination sanitization
router.get(
  "/products",
  authMiddleware.authenticate, // Ensure only authenticated users can access
  combineSanitization(searchQuerySanitization, paginationSanitization),
  logActivity,
  inventoryController.getProductList
);

// Get product details by ID
router.get(
  "/products/:id",
  authMiddleware.authenticate,
  productIdSanitization,
  logActivity,
  inventoryController.getProductById
);

module.exports = router;
