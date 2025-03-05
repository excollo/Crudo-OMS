const express = require("express");
const { logAuthActivity } = require("../loggers/authLogger");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { sanitizeMiddleware } = require("../sanitize/sanitize");

const router = express.Router();

// Authentication Routes
router.post(
  "/signup",
  [
    sanitizeMiddleware(["fullName", "email", "password", "role"]),
    logAuthActivity,
  ],
  authController.signup
);
router.post(
  "/signin",
  [sanitizeMiddleware(["email", "password"]), logAuthActivity],
  authController.signin
);
router.post("/logout", authMiddleware.verifyToken, authController.logout);

// Two-Factor Authentication Routes
router.post(
  "/enable-2fa",
  authMiddleware.verifyToken,
  authController.enableTwoFactor
);
router.post(
  "/verify-2fa-setup",
  [sanitizeMiddleware(["email", "token"]), authMiddleware.verifyToken],
  authController.verifyTwoFactorSetup
);
router.post(
  "/disable-2fa",
  authMiddleware.verifyToken,
  authController.disableTwoFactor
);
router.post(
  "/verify-2fa-setup",
  authMiddleware.verifyToken,
  authController.verifyTwoFactorSetup
);

// Password Reset Routes
router.post(
  "/request-password-reset",
  [sanitizeMiddleware(["email"]), logAuthActivity],
  authController.requestPasswordReset
);
router.post(
  "/reset-password",
  [sanitizeMiddleware(["token", "newPassword"]), logAuthActivity],
  authController.resetPassword
);

// Token Management Route
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
