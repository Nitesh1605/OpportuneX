import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";

// ✅ GET SAVED EVENTS
export const getSavedEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const user = await User.findById(userId).populate("savedEvents");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ✅ Guaranteed safe fallback
    const savedEvents = user.savedEvents || [];

    res.json(savedEvents);
  } catch (err) {
    console.error("getSavedEvents error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ✅ SAVE EVENT TO USER
export const saveEventToUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { eventId } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // ✅ Force initialize if undefined
    if (!user.savedEvents) {
      user.savedEvents = [];
    }

    const objectId = new mongoose.Types.ObjectId(eventId);

    // ✅ Prevent duplicates
    if (!user.savedEvents.some(id => String(id) === String(objectId))) {
      user.savedEvents.push(objectId);
      await user.save();
    }

    res.json({ msg: "Event saved" });
  } catch (err) {
    console.error("saveEventToUser error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ✅ REMOVE SAVED EVENT
export const deleteSavedEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { eventId } = req.params;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // ✅ Force initialize if undefined
    if (!user.savedEvents) {
      user.savedEvents = [];
    }

    user.savedEvents = user.savedEvents.filter(
      (id) => String(id) !== String(eventId)
    );

    await user.save();

    res.json({ msg: "Event removed" });
  } catch (err) {
    console.error("deleteSavedEvent error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ✅ GET USER PREFERENCES
export const getPreferences = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ preferredTypes: user.preferredTypes || [] });
  } catch (err) {
    console.error("getPreferences error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ✅ UPDATE USER PREFERENCES
export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { preferredTypes } = req.body as { preferredTypes?: string[] };

    if (!Array.isArray(preferredTypes)) {
      return res.status(400).json({ msg: "preferredTypes must be an array" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.preferredTypes = preferredTypes;
    await user.save();

    res.json({ preferredTypes: user.preferredTypes || [] });
  } catch (err) {
    console.error("updatePreferences error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
