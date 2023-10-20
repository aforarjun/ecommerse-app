import express from "express";
import {
  paymentProcess,
  stripeApiKey,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/process", paymentProcess);
router.get("/stripe-api", stripeApiKey);

export default router;
