import { Request, Response, NextFunction } from "express";

// Central error handler to avoid duplicating 500 responses everywhere
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ msg: message });
};