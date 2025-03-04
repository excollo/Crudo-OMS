const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongooseDelete = require("mongoose-delete");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "pharmacist"],
      default: "admin",
      immutable: true, // Prevents role updates
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshTokens: [
      {
        token: { type: String },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
      },
    ],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // Ensures createdAt is never changed
    },
  },
  {
    timestamps: true,
  }
);

// Apply soft delete plugin
UserSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

// Hide sensitive fields in JSON responses
UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.twoFactorSecret;
    return ret;
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  return resetToken;
};

// Securely add refresh token
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

// Check if refresh token is valid
UserSchema.methods.isValidRefreshToken = function (token) {
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  return this.refreshTokens.some(
    (rt) => rt.token === encryptedToken && rt.expiresAt > Date.now()
  );
};

// Cleanup expired refresh tokens
UserSchema.methods.removeExpiredTokens = function () {
  this.refreshTokens = this.refreshTokens.filter(
    (rt) => rt.expiresAt > Date.now()
  );
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
