
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo = (req as any).user;
    const userId = userInfo?.id;

    if (!userId) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: "Admin only" });
    }

    next();
  } catch (err) {
    console.error("adminOnly error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export default adminOnly;
