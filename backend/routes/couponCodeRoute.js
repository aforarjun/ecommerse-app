import express from "express";
import {
  createCouponCode,
  getCouponCodes,
  getCouponCode,
  deleteCouponCode,
} from "../controllers/couponCodeController.js";
import { isAuthenticatedUser, isSeller } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-coupon-code", isSeller, createCouponCode);

// get all coupons of a shop
router.get("/get-coupon-codes/:sellerId", isSeller, getCouponCodes);

// delete coupon
router.delete("/delete-coupon-code/:id", isSeller, deleteCouponCode);

// get a coupon details
router.get("/get-coupon-code/:name", isAuthenticatedUser, getCouponCode);

export default router;
