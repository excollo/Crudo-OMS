const express = require("express");
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const { logActivity } = require("../loggers/appLogger");
const {
  searchQuerySanitization,
  paginationSanitization,
  combineSanitization,
  customerSanitization,
  handleValidationErrors,
  customerUpdateSanitization
} = require("../sanitize/sanitize");

const router = express.Router();

// Get list of customers with search and pagination
router.get(
  "/customers",
  authMiddleware.authenticate,
  combineSanitization(searchQuerySanitization, paginationSanitization),
  logActivity,
  customerController.getCustomerList
);

// Get customer details by ID
router.get(
  "/customers/:id",
  authMiddleware.authenticate,
  logActivity,
  customerController.getCustomerById
);

router.post(
  "/create-customer",
  authMiddleware.authenticate,
  customerSanitization,
  handleValidationErrors,
  logActivity,
  customerController.createCustomer
);

router.put(
  "/update-customer/:id",
  authMiddleware.authenticate,
  customerUpdateSanitization,
  handleValidationErrors,
  logActivity,
  customerController.updateCustomer
);

module.exports = router;
