import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";
import protect from "../middleware/authMiddleware";
import adminOnly from "../middleware/adminMiddleware";
import { validate } from "../middleware/validateRequest";
import { eventSchema } from "../validation/eventSchemas";

const router = express.Router();

router.post("/", protect, adminOnly, validate(eventSchema), createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventDetails);
router.put("/:id", protect, adminOnly, validate(eventSchema), updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
