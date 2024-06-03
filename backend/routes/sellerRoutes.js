import express from "express";
import {
  createSeller,
  deleteSeller,
  forgetPassword,
  getSellerDetails,
  loadSeller,
  loginSeller,
  logoutSeller,
  resetPassword,
  updatePassword,
  updateSeller,
  updateSellerAvatar,
  verifySellerAccount,
} from "../controllers/sellerController.js";
import { isSeller } from "../middlewares/auth.js";
import { upload } from "../multer/multer.js";

const router = express.Router();

// register Shop
router.post("/create-seller", upload.single("file"), createSeller);
router.post("/verify-seller", verifySellerAccount);

// Login/Logout Seller
router.post("/login-seller", loginSeller);
router.get("/logout-seller", logoutSeller);

// Forget password  &  Reset password
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

// Update password    -   LOGGEDIN SELLLER
router.put("/update-password/:sellerId", isSeller, updatePassword);

// Load Seller
router.get("/load-seller", isSeller, loadSeller);

// Delete Seller   -   LOGGEDIN SELLLER
router.post("/delete-seller/:sellerId", isSeller, deleteSeller);

// Get Seller Details - ADMIN / LOGGEDIN SELLLER
router.get("/get-seller/:sellerId", isSeller, getSellerDetails);

// Update a Seller Details    -   ADMIN / LOGGEDIN SELLLER
router.put("/update-seller/:sellerId", isSeller, updateSeller);

// Update Seller avatar
router.put(
  "/update-seller-avatar",
  isSeller,
  upload.single("file"),
  updateSellerAvatar
);

export default router;
