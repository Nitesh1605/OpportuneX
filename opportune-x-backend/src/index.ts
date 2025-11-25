// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import protect from "./middleware/authMiddleware";
import './types/express';
import { Request, Response } from "express";



dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("OpportuneX API is running");
});

// Example of a protected route
app.get('/profile', protect, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
