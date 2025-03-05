const authService = require("../services/authService");
const { authLogger } = require("../loggers/authLogger");
const twoFactorService = require("../services/twoFactorService");
const { handleControllerError } = require("../utils/errorHandler");
const {sendResponse} = require("../utils/sendResponse")

const signup = async (req, res) => {
    try {
      const user = await authService.signup(req.body);
      authLogger.info(`User signed up: ${user.email}`);
      sendResponse(res, 201, "User registered successfully", { user });
    } catch (error) {
      handleControllerError(error, req, res, authLogger);
    }
}

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.signin({ email, password });

    if (result.requiresTwoFactor) {
      authLogger.info(`2FA required for user: ${email}`, {
        action: "2fa_required",
      });
      return sendResponse(res, 209, "Two-factor authentication required", {
        email,
        authType: "2fa",
      });
    }

    authLogger.info(`User logged in: ${result.user.email}`, {
      userId: result.user.id,
    });

    // Ensure tokens are properly sent in the response
    sendResponse(res, 200, "Login successful", {
      user: result.user,
      tokens: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    handleControllerError(error, req, res, authLogger);
  }
};

// New controller for 2FA verification
const verifyTwoFactor = async (req, res) => {
  try {
    const { email, token } = req.body;
    const result = await authService.verifyTwoFactorLogin(email, token);

    authLogger.info(`2FA verified for user: ${email}`);
    sendResponse(res, 200, "2FA verification successful", {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    handleControllerError(error, req, res, authLogger);
  }
};

const enableTwoFactor = async (req, res) => {
  try {
    const result = await twoFactorService.enableTwoFactor(req.user.id);
    sendResponse(res, 200, result.message, { method: result.method });
  } catch (error) {
    handleControllerError(error, req, res, authLogger);
  }
};

const verifyTwoFactorSetup = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await twoFactorService.verifyTwoFactorSetup(
      req.user.id,
      token
    );
    sendResponse(res, 200, result.message);
  } catch (error) {
    handleControllerError(error, req, res, authLogger);
  }
};

const disableTwoFactor = async (req, res) => {
  try {
    const result = await twoFactorService.disableTwoFactor(req.user.id);
    sendResponse(res, 200, result.message);
  } catch (error) {
    handleControllerError(error, req, res, authLogger);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendResponse(res, 400, "Refresh token is required");
    }

    const tokens = await authService.refreshToken(refreshToken);

    if (!tokens) {
      sendResponse(res, 401, "Invalid or expired refresh token");
    }

    sendResponse(res, 200, "Token refreshed successfully", tokens);
  } catch (error) {
    handleControllerError(error, req, res, authLogger);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendResponse(res, 400, "Refresh token is required");
    }

    await authService.logout(req.user.id, refreshToken);

    sendResponse(res, 200, "Logged out successfully");
  } catch (error) {
    handleControllerError(error, req, res, authLogger);
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, "Email is required");
    }

    await authService.requestPasswordReset(email);
    authLogger.info(`Password reset link sent to ${email}`);
    sendResponse(res, 200, "Password reset link sent to registered email.");
  } catch (error) {
    handleControllerError(error, req, res, authLogger);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendResponse(res, 400, "Token and new password are required");
    }

    await authService.resetPassword(token, newPassword);
    authLogger.info("Password successfully reset");
    sendResponse(res, 200, "Password successfully reset. You can now log in.");
  } catch (error) {
    handleControllerError(error, req, res, authLogger);
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
    disableTwoFactor
}