// src/routes/userRoutes.ts
import express from "express";
import { getSavedEvents, saveEventToUser, deleteSavedEvent } from "../controllers/userController";

const router = express.Router();

// Get saved events of the user
router.get("/saved-events", getSavedEvents);

// Save an event to user's saved events
router.post("/save-event", saveEventToUser);

// Delete a saved event from user's saved events
router.delete("/delete-event", deleteSavedEvent);

export default router;
