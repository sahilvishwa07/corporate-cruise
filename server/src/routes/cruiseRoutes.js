import express from "express";
import {
  createCruise,
  getCruises,
  getCruiseById,
  updateCruise,
  deleteCruise,
} from "../controllers/cruiseController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getCruises)
  .post(protect, authorize("admin"), createCruise);

router
  .route("/:id")
  .get(getCruiseById)
  .put(protect, authorize("admin"), updateCruise)
  .delete(protect, authorize("admin"), deleteCruise);

export default router;
