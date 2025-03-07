const authService = require("../services/authService");
const { appLogger } = require("../loggers/appLogger");
const twoFactorService = require("../services/twoFactorService");
const { handleControllerError } = require("../utils/errorHandler");
const { sendResponse } = require("../utils/sendResponse");

// Handle user signup
const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    appLogger.info(`User signed up: ${user.email}`);
    sendResponse(res, 201, "User registered successfully", { user });
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Handle user login with optional 2FA
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.signin({ email, password });

    if (result.requiresTwoFactor) {
      appLogger.info(`2FA required for user: ${email}`);
      return sendResponse(res, 209, "Two-factor authentication required", {
        email,
        authType: "2fa",
      });
    }

    appLogger.info(`User logged in: ${result.user.email}`);
    sendResponse(res, 200, "Login successful", {
      user: result.user,
      tokens: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Verify 2FA login
const verifyTwoFactor = async (req, res) => {
  try {
    const { email, token } = req.body;
    const result = await authService.verifyTwoFactorLogin(email, token);

    appLogger.info(`2FA verified for user: ${email}`);
    sendResponse(res, 200, "2FA verification successful", {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Enable 2FA for a user
const enableTwoFactor = async (req, res) => {
  try {
    const result = await twoFactorService.enableTwoFactor(req.user.id);
    sendResponse(res, 200, result.message, { method: result.method });
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Verify 2FA setup process
const verifyTwoFactorSetup = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await twoFactorService.verifyTwoFactorSetup(
      req.user.id,
      token
    );
    sendResponse(res, 200, result.message);
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Disable 2FA for a user
const disableTwoFactor = async (req, res) => {
  try {
    const result = await twoFactorService.disableTwoFactor(req.user.id);
    sendResponse(res, 200, result.message);
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Refresh access token using refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return sendResponse(res, 400, "Refresh token is required");

    const tokens = await authService.refreshToken(refreshToken);
    if (!tokens)
      return sendResponse(res, 401, "Invalid or expired refresh token");

    sendResponse(res, 200, "Token refreshed successfully", tokens);
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Handle user logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return sendResponse(res, 400, "Refresh token is required");

    await authService.logout(req.user.id, refreshToken);
    sendResponse(res, 200, "Logged out successfully");
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Request password reset link
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendResponse(res, 400, "Email is required");

    await authService.requestPasswordReset(email);
    appLogger.info(`Password reset link sent to ${email}`);
    sendResponse(res, 200, "Password reset link sent to registered email.");
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

// Reset user password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return sendResponse(res, 400, "Token and new password are required");
    }

    await authService.resetPassword(token, newPassword);
    appLogger.info("Password successfully reset");
    sendResponse(res, 200, "Password successfully reset. You can now log in.");
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

module.exports = {
  signup,
  signin,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  verifyTwoFactor,
  enableTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
};
