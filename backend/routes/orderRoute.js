import express from "express";
import { isAuthenticatedUser, isSeller } from "../middlewares/auth.js";
import {
  createOrder,
  getOrderDetails,
  getAllOrders,
  getAllSellerOrders,
  updateOrderStatus,
  deleteOrder,
  getAllUserOrders,
  requestRefundOrder,
  acceptRefundOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", createOrder);

router.get("/get-order/:id", getOrderDetails);
router.get("/get-all-orders", getAllOrders);
router.get("/get-seller-orders/:sellerId", getAllSellerOrders);
router.get("/get-user-orders/:userId", getAllUserOrders);

router.put("/update-order-status/:id", isSeller, updateOrderStatus);
router.delete("/delete-order/:id", isSeller, deleteOrder);

router.put("/request-order-refund/:id", requestRefundOrder);
router.put("/approve-order-refund/:id", isSeller, acceptRefundOrder);

export default router;
