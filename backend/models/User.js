const mongoose = require("mongoose");

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
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    membership: {
        isActive: {
          type: Boolean,
          default: true,
        },
        level: {
          type: String,
          enum: ["standard", "silver", "gold", "vip"],
          default: "standard",
        },
        discountPercentage: {
          type: Number,
          default: 5,
        },
        totalSpent: {
          type: Number,
          default: 0,
        },
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);