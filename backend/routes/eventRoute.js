import express from "express";
import { upload } from "../multer/multer.js";
import {
  createEvent,
  getEventDetails,
  getAllEvents,
  getAllSellerEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { isSeller } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-event", upload.array("images"), isSeller, createEvent);

router.get("/get-event/:id", getEventDetails);
router.get("/get-all-events", getAllEvents);
router.get("/get-seller-events/:sellerId", getAllSellerEvents);

router.put("/update-event/:id", isSeller, updateEvent);
router.delete("/delete-event/:id", isSeller, deleteEvent);

export default router;
