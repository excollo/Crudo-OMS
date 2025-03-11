const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const { logActivity } = require("../loggers/appLogger");
const {
  orderSanitization,
  handleValidationErrors,
} = require("../sanitize/sanitize");

const router = express.Router();

router.post(
  "/create-order",
  authMiddleware.authenticate,
  orderSanitization,
  handleValidationErrors,
  logActivity,
  orderController.createOrder
);

module.exports = router;
