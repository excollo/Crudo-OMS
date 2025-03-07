const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const {generateAccessToken, generateRefreshToken} = require("../utils/generateTokens");
const { UnauthorizedError, ConflictError, BadRequestError } = require("../utils/customErrors");
const { sendEmail } = require("../utils/sendEmail");
const { jwtConfig } = require("../config/config");
const {emailSanitization} = require("../sanitize/sanitize");

// Sign-up service
const signup = async (userData) => {
  if (!userData.role || !["admin", "pharmacist"].includes(userData.role)) {
    userData.role = "admin"; // Default role
  }

  const userExists = await User.findOne({ email: userData.email });
  if (userExists) throw new ConflictError("User already exists");
  const user = await User.create(userData);
  return user;
};

// Sign-in service
const signin = async ({ email, password }) => {
  const user = await User.findOne({ email }).select(
    "+password +twoFactorMethod"
  );
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new UnauthorizedError("Invalid credentials");

  if (user.twoFactorMethod !== "disabled") {
    // Generate and send 2FA token
    const otpToken = user.generateTwoFactorToken();
    await user.save();

    // Send OTP via email
    await sendEmail(
      user.email,
      "Login Verification Code",
      `Your login verification code is: ${otpToken}. 
       This code will expire in 10 minutes.`
    );

    // Return user ID for 2FA verification
    return {
      requiresTwoFactor: true,
      userId: user._id,
    };
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};


const verifyTwoFactorLogin = async (email, token) => {
  // Find user by email
  const user = await User.findOne({ email }).select(
    "+twoFactorTemporaryToken +twoFactorTokenExpires"
  );

  if (!user) {
    throw new BadRequestError("User not found");
  }

  // Validate token
  if (!user.validateTwoFactorToken(token)) {
    throw new UnauthorizedError("Invalid or expired verification code");
  }

  // Clear temporary token after successful verification
  user.twoFactorTemporaryToken = user.twoFactorTokenExpires = undefined;
  await user.save();

  return {
    user,
    generateAccessToken,
    generateRefreshToken,
  };
};

const refreshToken = async (token) => {
  if (!token) throw new UnauthorizedError("Refresh token is required");

  const decoded = jwt.verify(token, jwtConfig.refreshSecret);
  const user = await User.findById(decoded.id).select("+refreshTokens");

  if (!user || !user.refreshTokens.some((t) => t.token === token)) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Replace the old refresh token with a new one
  user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
  user.refreshTokens.push({ token: newRefreshToken });

  await user.save();

  return { newAccessToken, newRefreshToken };
};

const logout = async (userId, refreshToken) => {
  await User.updateOne(
    { _id: userId },
    { $pull: { refreshTokens: { token: refreshToken } } }
  );
};

// Password reset request
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new BadRequestError("User not found");

  if (user.resetPasswordExpires && user.resetPasswordExpires > Date.now()) {
    throw new BadRequestError("Reset already requested. Try again later.");
  }

  // Generate a secure reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Use a proper encryption method
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  // Ensure the key is exactly 32 bytes (AES-256 requires a 256-bit key)
  const key = crypto.createHash("sha256").update(secretKey).digest(); // Derive a 32-byte key
  const iv = crypto.randomBytes(16); // Initialization vector (IV) for AES

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(resetToken, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Store both the IV and encrypted token (IV is needed for decryption)
  user.resetPasswordToken = `${iv.toString("hex")}:${encrypted}`;
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
  verifyTwoFactorLogin
};
