const express = require("express");
const { body } = require("express-validator"); 
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

router.get(
  "/orders",
  authMiddleware.authenticate,
  logActivity,
  orderController.getAllOrders
)

router.get(
  "/orders/:orderId",
  authMiddleware.authenticate,
  logActivity,
  orderController.getOrderById
)

router.put(
  "/orders/:orderId/status",
  authMiddleware.authenticate,
  [
    body("status")
      .isString()
      .isIn([
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ])
      .withMessage("Invalid status value"), 
    body("remarks").optional().isString(),
    body("employeeId").optional().isNumeric(),
  ],
  handleValidationErrors,
  logActivity,
  orderController.updateOrderStatus
);

module.exports = router;
