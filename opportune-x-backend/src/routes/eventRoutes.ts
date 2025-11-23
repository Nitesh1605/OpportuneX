import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
} from "../controllers/eventController";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent); // later: add auth middleware

export default router;
