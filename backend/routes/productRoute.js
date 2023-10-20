import express from "express";
import { upload } from "../multer/multer.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsAdmin,
  getAllSellerProducts,
  getProductDetails,
  reviewProduct,
  updateProduct,
} from "../controllers/productController.js";
import { isAuthenticatedUser, isSeller, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-product", upload.array("images"), isSeller, createProduct);

router.get("/get-product/:id", getProductDetails);
router.get("/get-all-products", getAllProducts);
router.get("/get-seller-products/:sellerId", getAllSellerProducts);

router.put("/update-product/:id", isSeller, updateProduct);
router.delete("/delete-product/:id", isSeller, deleteProduct);

router.put("/create-new-review", isAuthenticatedUser, reviewProduct);

router.get(
  "/admin-all-products",
  isAuthenticatedUser,
  isAdmin("Admin"),
  getAllProductsAdmin
);

export default router;
