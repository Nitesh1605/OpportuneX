import User from "../models/User";
import Event from "../models/Event";
import { Request, Response } from "express";

// Get Saved Events for User
export const getSavedEvents = async (req: any, res: Response) => {
  try {
    // Find user by ID (from token)
    const user = await User.findById(req.user.id).populate("savedEvents");
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Return user's saved events
    res.json(user.savedEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
