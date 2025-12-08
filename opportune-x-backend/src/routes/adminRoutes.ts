import express from "express";
import protect from "../middleware/authMiddleware";
import adminOnly from "../middleware/adminMiddleware";
import { getAdminStats } from "../controllers/adminController";

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);

export default router;