const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { sanitizeMiddleware } = require("../sanitize/sanitize");
const { logActivity } = require("../loggers/appLogger");

const router = express.Router();

// Authentication Routes
router.post(
  "/signup",
  [sanitizeMiddleware(["fullName", "email", "password", "role"]), logActivity],
  authController.signup
);
router.post(
  "/signin",
  [sanitizeMiddleware(["email", "password"]), logActivity],
  authController.signin
);
router.post("/logout", authMiddleware.authenticate, authController.logout);

// Two-Factor Authentication Routes
router.post(
  "/enable-2fa",
  authMiddleware.authenticate,
  authController.enableTwoFactor
);
router.post(
  "/verify-2fa-setup",
  [sanitizeMiddleware(["email", "token"]), authMiddleware.authenticate],
  authController.verifyTwoFactorSetup
);
router.post('/verify-2fa', 
  sanitizeMiddleware(['email', 'token']), 
  authController.verifyTwoFactor
);
router.post(
  "/disable-2fa",
  authMiddleware.authenticate,
  authController.disableTwoFactor
);

// Password Reset Routes
router.post(
  "/request-password-reset",
  [sanitizeMiddleware(["email"]), logActivity],
  authController.requestPasswordReset
);

router.post(
  "/reset-password",
  [sanitizeMiddleware(["token", "newPassword"]), logActivity],
  authController.resetPassword
);

// Token Management Route
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
