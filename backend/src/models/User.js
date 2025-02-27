const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "pharmacist"],
      required: true,
      default: "admin",
    },
    // Pharmacist-specific fields
    phone: {
      type: String,
      required: function () {
        return this.role === "pharmacist";
      },
    },
    employeeId: {
      type: String,
      unique: true,
      required: function () {
        return this.role === "pharmacist";
      },
    },
    assignedPharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: function () {
        return this.role === "pharmacist";
      },
    },
    // Admins manage multiple pharmacies
    managedPharmacies: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Pharmacy" },
    ],
    isActive: {
      type: Boolean,
      default: true, // Soft delete flag
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
}
);

// Method to check password match
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;