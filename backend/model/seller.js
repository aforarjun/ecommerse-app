import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Seller name!"],
  },
  shopName: {
    type: String,
    required: [true, "Please enter your Shop name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Shop email!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phoneNumber: {
    type: String,
  },
  description: {
    type: String,
    require: true,
  },
  address: {
    country: {
      index: String,
      value: String,
    },
    city: {
      index: String,
      value: String,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    zipCode: {
      type: Number,
      required: true,
    },
  },
  role: {
    type: String,
    default: "Seller",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  verifyToken: String,
  verifyTokenExpiry: Date,

  resetPasswordToken: String,
  resetPasswordExpiry: Date,
});

//  Hash password
sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
sellerSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
sellerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ** IMPORTANT ** Generating reset password token **
sellerSchema.methods.getResetPasswordToken = function () {
  // generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding to userShema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // adding password expire
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mint for reset password

  return resetToken;
};

export default mongoose.model("Seller", sellerSchema);
