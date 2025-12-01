import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";
import protect from "../middleware/authMiddleware";
import adminOnly from "../middleware/adminMiddleware"; // you should have this or similar

const router = express.Router();

router.post("/", protect, adminOnly, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventDetails);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
