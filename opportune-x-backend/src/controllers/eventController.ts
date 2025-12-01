import { Request, Response } from "express";
import Event from "../models/Event"; // make sure model exists at src/models/Event

// Create event (admin)
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, org, applyUrl } = req.body;

    if (!title || !org || !applyUrl) {
      return res.status(400).json({
        msg: "Title, organization and applyUrl are required",
      });
    }

    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all events
export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    // Sort by upcoming deadline first; fallback is createdAt (most recent)
    const events = await Event.find().sort({ deadline: 1, createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("getAllEvents error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get single event details
export const getEventDetails = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("getEventDetails error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update event (admin)
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { title, org, applyUrl } = req.body;

    if (!title || !org || !applyUrl) {
      return res.status(400).json({
        msg: "Title, organization and applyUrl are required",
      });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ msg: "Event not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateEvent error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete event (admin)
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Event not found" });
    res.json({ msg: "Event deleted" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
