const authService = require("../services/authService");
const { authLogger } = require("../loggers/authLogger");

// Utility function for sending responses
const sendResponse = (res, status, message, data = {}) => {
  return res.status(status).json({ message, ...data });
};

const signup = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return sendResponse(res, 400, "Email and password are required");
    }

    const user = await authService.signup(req.body);

    authLogger.info(`User signed up: ${user.email}`);
    sendResponse(res, 201, "User registered successfully", { user });
  } catch (error) {
    authLogger.error(`Signup error: ${error.message}`);
    sendResponse(res, 400, error.message);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, "Email and password are required");
    }

    const { user, accessToken, refreshToken } = await authService.signin(
      req.body
    );

    authLogger.info(`User logged in: ${user.email}`);
    sendResponse(res, 200, "Login successful", {
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    authLogger.error(`Signin error: ${error.message}`);
    sendResponse(res, 401, error.message);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendResponse(res, 400, "Refresh token is required");
    }

    const tokens = await authService.refreshToken(refreshToken);

    if (!tokens) {
      return sendResponse(res, 401, "Invalid or expired refresh token");
    }

    sendResponse(res, 200, "Token refreshed successfully", tokens);
  } catch (error) {
    authLogger.error(`Refresh token error: ${error.message}`);
    sendResponse(res, 500, "Internal server error");
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendResponse(res, 400, "Refresh token is required");
    }

    await authService.logout(req.user.id, refreshToken);

    sendResponse(res, 200, "Logged out successfully");
  } catch (error) {
    authLogger.error(`Logout error: ${error.message}`);
    sendResponse(res, 500, error.message);
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
    authLogger.error(`Error requesting password reset: ${error.message}`);
    sendResponse(res, 500, "Internal server error");
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
    authLogger.error(`Error resetting password: ${error.message}`);
    sendResponse(res, 400, error.message);
  }
};

module.exports = {
  signup,
  signin,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
};
