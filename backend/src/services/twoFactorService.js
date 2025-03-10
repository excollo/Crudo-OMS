const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");
const { BadRequestError, UnauthorizedError } = require("../utils/customErrors");

class TwoFactorService {
  /**
   * Fetches a user by ID with optional selected fields.
   * @param {string} userId - The user's unique identifier.
   * @param {string} fields - Optional fields to select.
   * @returns {Promise<User>} - The user object.
   * @throws {BadRequestError} - If the user is not found.
   */
  async getUserById(userId, fields = "") {
    const user = await User.findById(userId).select(fields);
    if (!user) throw new BadRequestError("User not found");
    return user;
  }

  /**
   * Clears temporary 2FA tokens from the user object.
   * @param {User} user - The user object.
   * @returns {Promise<User>} - The updated user object.
   */
  async clearTwoFactorTokens(user) {
    user.twoFactorTemporaryToken = undefined;
    user.twoFactorTokenExpires = undefined;
    return user.save();
  }

  /**
   * Enables two-factor authentication for a user.
   * @param {string} userId - The user's unique identifier.
   * @param {string} method - The 2FA method (default: email).
   * @returns {Promise<Object>} - Success message and method used.
   */
  async enableTwoFactor(userId, method = "email") {
    const user = await this.getUserById(userId);

    // Generate a temporary OTP for 2FA setup
    const otpToken = user.generateTwoFactorToken();
    await user.save();

    // Send OTP to user's email
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

  /**
   * Verifies the 2FA setup using the provided token.
   * @param {string} userId - The user's unique identifier.
   * @param {string} token - The OTP provided by the user.
   * @returns {Promise<Object>} - Success message if verification passes.
   * @throws {UnauthorizedError} - If the token is invalid or expired.
   */

  /**
   * Disables two-factor authentication for a user.
   * @param {string} userId - The user's unique identifier.
   * @returns {Promise<Object>} - Success message.
   */
  async disableTwoFactor(userId) {
    const user = await this.getUserById(userId);
    user.twoFactorMethod = "disabled";
    await user.save();

    return { message: "2FA successfully disabled" };
  }

  /**
   * Verifies 2FA during login.
   * @param {string} email - The user's email.
   * @param {string} token - The OTP provided by the user.
   * @returns {Promise<User>} - The authenticated user object.
   * @throws {UnauthorizedError} - If the token is invalid or expired.
   */
  async verifyTwoFactorLogin(email, token) {
    const user = await this.getUserById(
      email,
      "+twoFactorTemporaryToken +twoFactorTokenExpires"
    );

    // Validate the provided token
    if (!user.validateTwoFactorToken(token)) {
      throw new UnauthorizedError("Invalid or expired verification code");
    }

    // Clear temporary 2FA tokens upon successful verification
    await this.clearTwoFactorTokens(user);
    return user;
  }
}

module.exports = new TwoFactorService();
