// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    if (!token) {
      return res.status(401).json({ msg: "Not authorized, token missing" });
    }

    const secret = process.env.JWT_SECRET || "yoursecret";
    const decoded = jwt.verify(token, secret) as { id?: string }; // typed payload

    // Use type assertion because we augmented Request with user in d.ts
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error("Auth protect error:", err);
    return res.status(401).json({ msg: "Not authorized, token invalid" });
  }
};

export default protect;
