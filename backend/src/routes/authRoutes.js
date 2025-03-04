const express = require("express");
const { logAuthActivity } = require("../loggers/authLogger");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const sanitizeRequest = require("../sanitize/sanitize");

const router = express.Router();

router.post("/signup", sanitizeRequest, logAuthActivity, authController.signup);
router.post("/signin", sanitizeRequest, logAuthActivity, authController.signin);
router.post("/refresh-token", sanitizeRequest, authController.refreshToken);
router.post(
  "/logout",
  authMiddleware.verifyToken,
  sanitizeRequest,
  authController.logout
);
router.post(
  "/request-password-reset",
  sanitizeRequest,
  logAuthActivity,
  authController.requestPasswordReset
);
router.post(
  "/reset-password",
  sanitizeRequest,
  logAuthActivity,
  authController.resetPassword
);

module.exports = router;
