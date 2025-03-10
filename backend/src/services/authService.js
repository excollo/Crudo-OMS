const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const {generateAccessToken, generateRefreshToken} = require("../utils/generateTokens");
const { UnauthorizedError, ConflictError, BadRequestError } = require("../utils/customErrors");
const { sendEmail } = require("../utils/sendEmail");
const { jwtConfig } = require("../config/config");

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
      email: user.email,
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
  user.twoFactorTemporaryToken = undefined;
  user.twoFactorTokenExpires = undefined;
  await user.save();

  // Generate new tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken) => {
  try {
    // Verify the refresh token
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!payload) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Get user from database using payload.id
    const user = await User.findById(payload.id);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user._id);

    // Store new refresh token in database if you're tracking them
    // await storeRefreshToken(user._id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    throw error;
  }
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
  console.log("Generated reset token:", resetToken.substring(0, 10) + "...");

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  // Encrypt token
  const key = crypto.createHash("sha256").update(secretKey).digest();
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(resetToken, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Store encrypted token
  user.resetPasswordToken = `${iv.toString("hex")}:${encrypted}`;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Send reset email
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail(
    user.email,
    "Password Reset Request",
    `Click here to reset your password: ${resetURL}\nValid for 10 minutes.`
  );

  return { message: "Password reset email sent" };
};

// Reset password service
const resetPassword = async (token, newPassword) => {

  // Find user with valid reset token and not expired
  const users = await User.find({
    resetPasswordToken: { $exists: true, $ne: null },
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  let validUser = null;

  for (const user of users) {
    try {
      if (!user.resetPasswordToken) {
        console.log("Skipping user with null reset token");
        continue;
      }

      // Decrypt and verify token for each user
      const [ivHex, encryptedToken] = user.resetPasswordToken.split(":");

      if (!ivHex || !encryptedToken) {
        console.log("Invalid token format for user");
        continue;
      }

      const iv = Buffer.from(ivHex, "hex");
      const key = crypto
        .createHash("sha256")
        .update(process.env.SECRET_KEY)
        .digest();

      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(encryptedToken, "hex", "utf8");
      decrypted += decipher.final("utf8");

      if (decrypted === token) {
        validUser = user;
        break;
      }
    } catch (err) {
      console.error("Error processing user token:", err.message);
      console.error("Full error:", err);
      continue;
    }
  }

  if (!validUser) {
    throw new BadRequestError("Invalid or expired token");
  }

  // Update password for valid user
  validUser.password = await bcrypt.hash(newPassword, 10);
  validUser.resetPasswordToken = undefined;
  validUser.resetPasswordExpires = undefined;

  await validUser.save();
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
