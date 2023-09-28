import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter product name"],
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    index: Number,
    value: String,
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
    required: [true, "Please enter original price of the product"],
  },
  discountPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    required: [true, "Please enter stock of the product"],
    default: 0,
  },
  startDate: {
    type: String,
    required: [true, "Please enter Start Date"],
  },
  endDate: {
    type: String,
    required: [true, "Please enter End Date"],
  },
  sellerId: {
    type: String,
    required: [true, "Shop id is required."],
  },
  seller: {
    type: Object,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Event", eventSchema);
