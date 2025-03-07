const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongooseDelete = require("mongoose-delete");

// Define User schema
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Exclude password from queries by default
    },
    role: {
      type: String,
      enum: ["admin", "pharmacist"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Two-Factor Authentication Fields
    twoFactorMethod: {
      type: String,
      enum: ["email", "disabled"],
      default: "disabled",
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    twoFactorTemporaryToken: {
      type: String,
      select: false,
    },
    twoFactorTokenExpires: {
      type: Date,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete implementation
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
      },
    ],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // Prevent modification
    },
  },
  {
    timestamps: true,
  }
);

// Enable soft delete functionality
UserSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

// Hide sensitive fields when returning user data
UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.twoFactorSecret;
    return ret;
  },
});

// Virtual property to check if account is locked
UserSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate temporary 2FA token
UserSchema.methods.generateTwoFactorToken = function () {
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.twoFactorTemporaryToken = token;
  this.twoFactorTokenExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 min
  return token;
};

// Validate 2FA token
UserSchema.methods.validateTwoFactorToken = function (token) {
  return (
    this.twoFactorTemporaryToken === token &&
    this.twoFactorTokenExpires > Date.now()
  );
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 min
  return resetToken;
};

// Add refresh token with expiration
UserSchema.methods.addRefreshToken = function (token, expiresIn) {
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.refreshTokens.push({
    token: encryptedToken,
    expiresAt: Date.now() + expiresIn,
  });
};

// Validate refresh token
UserSchema.methods.isValidRefreshToken = function (token) {
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  return this.refreshTokens.some(
    (rt) => rt.token === encryptedToken && rt.expiresAt > Date.now()
  );
};

// Remove expired refresh tokens
UserSchema.methods.removeExpiredTokens = function () {
  this.refreshTokens = this.refreshTokens.filter(
    (rt) => rt.expiresAt > Date.now()
  );
};

// Increment failed login attempts and lock if exceeded
UserSchema.methods.incrementLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
  }

  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 60 * 60 * 1000; // Lock for 1 hour
  }
  return this.save();
};

// Reset failed login attempts
UserSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
