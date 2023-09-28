import mongoose from "mongoose";

const couponCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your coupoun code name!"],
    unique: true,
  },
  value: {
    type: Number,
    required: [true, "Discound percentage is required"],
  },
  minAmount: {
    type: Number,
  },
  maxAmount: {
    type: Number,
  },
  sellerId: {
    type: String,
    required: [true, "sellerId is required"],
  },
  product: {
    type: Object,
    required: [true, "Product is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("CouponCode", couponCodeSchema);
