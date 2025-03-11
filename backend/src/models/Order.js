const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const ProductSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: [true, "Product ID is required"],
    validate: {
      validator: Number.isInteger,
      message: "Product ID must be an integer",
    },
  },
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    minlength: [2, "Product name must be at least 2 characters"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
});

// Add compound index for better query performance
ProductSchema.index({ productId: 1, name: 1 });

const StatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: [true, "Status is required"],
      uppercase: true,
      enum: {
        values: [
          "PENDING",
          "CONFIRMED",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ],
        message: "{VALUE} is not a valid status",
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    swilOrderId: {
      type: Number,
      required: [true, "Order ID is required"],
      unique: true,
      index: true,
      validate: {
        validator: function (v) {
          return Number.isInteger(v) && v > 0;
        },
        message: "Order ID must be a positive integer",
      },
    },
    orderStatus: {
      type: String,
      required: true,
      uppercase: true,
      enum: {
        values: [
          "PENDING",
          "CONFIRMED",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ],
        message: "{VALUE} is not a valid status",
      },
      default: "PENDING",
    },
    orderStatusHistory: [StatusHistorySchema],
    customer: {
      customerId: {
        type: Number,
        required: [true, "Customer ID is required"],
        index: true,
        validate: {
          validator: Number.isInteger,
          message: "Customer ID must be an integer",
        },
      },
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        validate: {
          validator: function (v) {
            return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
          },
          message: "Please enter a valid email",
        },
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
        minlength: [5, "Address must be at least 5 characters"],
      },
      age: {
        type: Number,
        required: [true, "Age is required"],
        min: [0, "Age cannot be negative"],
        max: [120, "Age cannot exceed 150"],
      },
      sex: {
        type: String,
        enum: {
          values: ["Male", "Female", "Other"],
          message: "{VALUE} is not a valid gender",
        },
        required: true,
      },
      abhanumber: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return !v || /^\d{14}$/.test(v);
          },
          message: "ABHA number must be 14 digits",
        },
      },
    },
    products: {
      type: [ProductSchema],
      validate: [
        {
          validator: function (v) {
            return v.length > 0;
          },
          message: "At least one product is required",
        },
      ],
    },
    payment: {
      method: {
        type: String,
        required: [true, "Payment method is required"],
        enum: {
          values: ["COD", "UPI"],
          message: "{VALUE} is not a valid payment method",
        },
      },
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: [0, "Subtotal cannot be negative"],
      },
      discount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
        validate: {
          validator: function (v) {
            // If this is a new document, use the calculated subtotal
            const currentSubtotal = this.isNew
              ? this.products.reduce(
                  (total, product) => total + product.price * product.quantity,
                  0
                )
              : this.pricing.subtotal;
            return v <= currentSubtotal;
          },
          message: "Discount cannot be greater than subtotal",
        },
      },
      totalAmount: {
        type: Number,
        required: true,
        min: [0, "Total amount cannot be negative"],
        validate: {
          validator: function (v) {
            const currentSubtotal = this.pricing.subtotal;
            const currentDiscount = this.pricing.discount || 0;
            return v === currentSubtotal - currentDiscount;
          },
          message: "Total amount must equal subtotal minus discount",
        },
      },
    },
  },
  {
    timestamps: true,
    // Add optimistic concurrency control
    optimisticConcurrency: true,
    // Add query logging in development
    logging: process.env.NODE_ENV === "development",
  }
);

// Optimize indexes for common queries
OrderSchema.index({ "customer.customerId": 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
OrderSchema.index({ "customer.email": 1 });
OrderSchema.index({ createdAt: -1 });

// Add mongoose-delete plugin with improved options
OrderSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
  indexFields: ["deleted", "deletedAt"],
});

// Improved order status update method with validation
OrderSchema.methods.updateOrderStatus = function (newStatus, note = "") {
  const validStatuses = this.schema.path("orderStatus").enumValues;
  if (!validStatuses.includes(newStatus)) {
    throw new Error(
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    );
  }

  this.orderStatus = newStatus;
  this.orderStatusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note.trim(),
  });
};

OrderSchema.pre("validate", function (next) {
  if (this.isModified("products") || this.isNew) {
    const subtotal = this.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    this.pricing = {
      ...this.pricing,
      subtotal: subtotal,
      discount: Math.min(this.pricing?.discount || 0, subtotal),
      totalAmount: subtotal - Math.min(this.pricing?.discount || 0, subtotal),
    };
  }
  next();
});

// Remove or update the existing pre-save middleware since calculations are now done in pre-validate
OrderSchema.pre("save", function (next) {
  next();
});

// Add error handling for duplicate order IDs
OrderSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Order ID must be unique"));
  } else {
    next(error);
  }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = {
  Order,
};
