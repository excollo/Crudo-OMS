const { jwtConfig } = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

const signup = async (userData) => {
  const userExists = await User.findOne({ email: userData.email });
  if (userExists) throw new Error("User already Exists");
  const user = await User.create(userData);
  return user;
};

const signin = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = jwt.sign({ id: user._id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
  const refreshToken = jwt.sign({ id: user._id }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });

  return { user, accessToken, refreshToken };
};

const refreshToken = async (token) => {
  const decoded = jwt.verify(token, jwtConfig.refreshSecret);
  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
    }
  );
  const refreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    jwtConfig.refreshSecret,
    {
      expiresIn: jwtConfig.refreshExpiresIn,
    }
  );
  return { accessToken, refreshToken };
};

const logout = async (userId, refreshToken) => {
  await User.updateOne(
    { _id: userId }, // Find user by ID
    { $pull: { refreshTokens: { token: refreshToken } } } // Remove the refreshToken
  );
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

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
  resetPassword
};
