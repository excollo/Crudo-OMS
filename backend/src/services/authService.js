const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");
const { jwtConfig } = require("../config/config");
const sanitizeRequest = require("../sanitize/sanitize");
const { BadRequestError, UnauthorizedError } = require("../utils/customErrors");

// Helper function to generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
  const refreshToken = jwt.sign({ id: userId }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });

  return { accessToken, refreshToken };
};

// Sign-up service
const signup = async (userData) => {
  // Sanitize input to prevent NoSQL injection
  sanitizeRequest({ body: userData });

  const userExists = await User.findOne({ email: userData.email });
  if (userExists) throw new BadRequestError("User already exists");

  const user = await User.create(userData);
  return user;
};

// Sign-in service
const signin = async ({ email, password }) => {
  sanitizeRequest({ body: { email, password } });

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new UnauthorizedError("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new UnauthorizedError("Invalid credentials");

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Store refresh token in user document
  user.refreshTokens.push({ token: refreshToken, createdAt: Date.now() });
  await user.save();

  return { user, accessToken, refreshToken };
};

// Refresh token service
const refreshToken = async (token) => {
  if (!token) throw new UnauthorizedError("Refresh token is required");

  const decoded = jwt.verify(token, jwtConfig.refreshSecret);
  return generateTokens(decoded.id);
};

// Logout service
const logout = async (userId, refreshToken) => {
  await User.updateOne(
    { _id: userId },
    { $pull: { refreshTokens: { token: refreshToken } } }
  );
};

// Password reset request
const requestPasswordReset = async (email) => {
  sanitizeRequest({ body: { email } });

  const user = await User.findOne({ email });
  if (!user) throw new BadRequestError("User not found");

  // Generate secure reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry

  await user.save();

  // Send reset email
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail(
    user.email,
    "Password Reset Request",
    `Click here: ${resetURL}`
  );

  return { message: "Password reset email sent" };
};

// Reset password service
const resetPassword = async (token, newPassword) => {
  sanitizeRequest({ body: { newPassword } });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new BadRequestError("Invalid or expired token");

  // Hash and update password
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return { message: "Password successfully reset" };
};

module.exports = {
  signup,
  signin,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
};
