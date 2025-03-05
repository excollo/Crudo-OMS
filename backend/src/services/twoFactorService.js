const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");
const { BadRequestError, UnauthorizedError } = require("../utils/customErrors");

class TwoFactorService {
  // Helper method to get user with optional selected fields
  async getUserById(userId, fields = "") {
    const user = await User.findById(userId).select(fields);
    if (!user) throw new BadRequestError("User not found");
    return user;
  }

  // Helper method to clear temporary 2FA tokens
  async clearTwoFactorTokens(user) {
    user.twoFactorTemporaryToken = undefined;
    user.twoFactorTokenExpires = undefined;
    return user.save();
  }

  // Enable 2FA for a user
  async enableTwoFactor(userId, method = "email") {
    const user = await this.getUserById(userId);

    // Generate and send OTP
    const otpToken = user.generateTwoFactorToken();
    await user.save();

    await sendEmail(
      user.email,
      "Two-Factor Authentication Setup",
      `Your 2FA verification code is: ${otpToken}. This code will expire in 10 minutes.`
    );

    return {
      message: "2FA setup initiated. Check your email for the code.",
      method,
    };
  }

  // Verify 2FA setup
  async verifyTwoFactorSetup(userId, token) {
    const user = await this.getUserById(
      userId,
      "+twoFactorTemporaryToken +twoFactorTokenExpires"
    );

    if (!user.validateTwoFactorToken(token)) {
      throw new UnauthorizedError("Invalid or expired verification code");
    }

    user.twoFactorMethod = "email";
    await this.clearTwoFactorTokens(user);

    return { message: "2FA successfully enabled" };
  }

  // Disable 2FA
  async disableTwoFactor(userId) {
    const user = await this.getUserById(userId);
    user.twoFactorMethod = "disabled";
    await user.save();

    return { message: "2FA successfully disabled" };
  }

  // Handle 2FA login verification
  async verifyTwoFactorLogin(email, token) {
    const user = await this.getUserById(
      email,
      "+twoFactorTemporaryToken +twoFactorTokenExpires"
    );

    if (!user.validateTwoFactorToken(token)) {
      throw new UnauthorizedError("Invalid or expired verification code");
    }

    await this.clearTwoFactorTokens(user);
    return user;
  }
}

module.exports = new TwoFactorService();
