import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.get("/", protect, authorize("admin"), getAllBookings);

export default router;
