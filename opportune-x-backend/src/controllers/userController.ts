import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import { ALERT_PREF_DEFAULTS, buildUserAlerts } from "../services/alertService";

// ✅ GET SAVED EVENTS
export const getSavedEvents = async (req: Request, res: Response, next: NextFunction) => {
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
    next(err);
  }
};

// ✅ SAVE EVENT TO USER
export const saveEventToUser = async (req: Request, res: Response, next: NextFunction) => {
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
    next(err);
  }
};

// ✅ REMOVE SAVED EVENT
export const deleteSavedEvent = async (req: Request, res: Response, next: NextFunction) => {
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
    next(err);
  }
};

// ✅ GET USER PREFERENCES
export const getPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ preferredTypes: user.preferredTypes || [] });
  } catch (err) {
    console.error("getPreferences error:", err);
    next(err);
  }
};

// ✅ UPDATE USER PREFERENCES
export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
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
    next(err);
  }
};

export const getAlertPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.alertPreferences || ALERT_PREF_DEFAULTS);
  } catch (err) {
    console.error("getAlertPreferences error:", err);
    next(err);
  }
};

export const updateAlertPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const { newMatches, weeklyDigest, deadlineReminderDays, lookbackDays } =
      req.body || {};

    if (
      (deadlineReminderDays !== undefined &&
        (typeof deadlineReminderDays !== "number" || deadlineReminderDays < 1)) ||
      (lookbackDays !== undefined &&
        (typeof lookbackDays !== "number" || lookbackDays < 1))
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid deadlineReminderDays or lookbackDays value" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.alertPreferences = {
      ...ALERT_PREF_DEFAULTS,
      ...(user.alertPreferences || {}),
      ...(newMatches === undefined ? {} : { newMatches }),
      ...(weeklyDigest === undefined ? {} : { weeklyDigest }),
      ...(deadlineReminderDays === undefined
        ? {}
        : { deadlineReminderDays }),
      ...(lookbackDays === undefined ? {} : { lookbackDays }),
    };

    await user.save();

    res.json(user.alertPreferences);
  } catch (err) {
    console.error("updateAlertPreferences error:", err);
    next(err);
  }
};

export const getAlerts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId).populate("savedEvents");

    if (!user) return res.status(404).json({ msg: "User not found" });

    const result = await buildUserAlerts(user as any);
    res.json(result);
  } catch (err) {
    console.error("getAlerts error:", err);
    next(err);
  }
};

// ✅ UPDATE USER PROFILE
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      // Password hashing is handled by the pre-save hook in User model
      user.password = password;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: (req as any).token // Optionally return a new token if needed, but usually not required unless claims change
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    next(err);
  }
};
