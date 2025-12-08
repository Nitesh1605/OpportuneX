import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Event from "../models/Event";

export const getAdminStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [userCount, eventCount, eventsByType, eventsBySource] =
      await Promise.all([
        User.countDocuments(),
        Event.countDocuments(),
        Event.aggregate([
          { $group: { _id: "$type", count: { $sum: 1 } } },
        ]),
        Event.aggregate([
          { $group: { _id: "$source", count: { $sum: 1 } } },
        ]),
      ]);

    res.json({
      userCount,
      eventCount,
      eventsByType,
      eventsBySource,
    });
  } catch (err) {
    next(err);
  }
};