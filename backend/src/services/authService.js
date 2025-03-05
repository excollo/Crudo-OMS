const { jwtConfig } = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const {generateAccessToken, generateRefreshToken} = require("../utils/generateTokens");
const { UnauthorizedError, ConflictError, BadRequestError } = require("../utils/customErrors");
const { sendEmail } = require("../utils/sendEmail");

const signup = async (userData) => {
  if (!userData.role || !["admin", "pharmacist"].includes(userData.role)) {
    userData.role = "admin"; // Default role
  }

  const userExists = await User.findOne({ email: userData.email });
  if (userExists) throw new ConflictError("User already exists");
  const user = await User.create(userData);
  return user;
};

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
  const decoded = jwt.verify(token, jwtConfig.refreshSecret);
  const user = await User.findById(decoded.id).select("+refreshTokens");
  
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  return { newAccessToken, newRefreshToken };
};

const logout = async (userId, refreshToken) => {
  await User.updateOne(
    { _id: userId }, // Find user by ID
    { $pull: { refreshTokens: { token: refreshToken } } } // Remove the refreshToken
  );
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw new BadRequestError("User not found");

  // Generate a random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token before storing it
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Store the hashed token in the database
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

  await user.save();

  // Send the reset email with the **RAW token**
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail(
    user.email,
    "Password Reset Request",
    `Click here: ${resetURL}`
  );

  return { message: "Password reset email sent" };
};

const resetPassword = async (token, newPassword) => {

  // Instead of hashing again, directly use the received token for lookup
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    console.error("Invalid or Expired Token");
    throw new Error("Invalid or expired token");
  }

  // Hash new password
  user.password = await bcrypt.hash(newPassword, 10);

  // Clear reset token fields
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
