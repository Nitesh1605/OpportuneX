import express from "express";
import {
  getSavedEvents,
  saveEventToUser,
  deleteSavedEvent,
  getPreferences,
  updatePreferences,
  getAlertPreferences,
  updateAlertPreferences,
  getAlerts,
  updateProfile,
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
router.get("/alerts/preferences", protect, getAlertPreferences);
router.put("/alerts/preferences", protect, updateAlertPreferences);
router.get("/alerts", protect, getAlerts);

// ✅ Profile endpoint
router.get("/profile", protect, async (req, res) => {
  const user = await import("../models/User").then(m => m.default.findById((req as any).user.id).populate("savedEvents"));
  res.json(user);
});
router.put("/profile", protect, updateProfile);

export default router;
