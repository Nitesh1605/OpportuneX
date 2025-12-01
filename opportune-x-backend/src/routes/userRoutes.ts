import express from "express";
import {
  getSavedEvents,
  saveEventToUser,
  deleteSavedEvent,
  getPreferences,
  updatePreferences,
} from "../controllers/userController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Get all saved events of user
router.get("/saved-events", protect, getSavedEvents);

// ✅ Save an event
router.post("/save-event", protect, saveEventToUser);

// ✅ Remove saved event
router.delete("/save-event/:eventId", protect, deleteSavedEvent);

// ✅ Preferences endpoints
router.get("/preferences", protect, getPreferences);
router.put("/preferences", protect, updatePreferences);

export default router;
