
import express from "express";
import { register, login } from "../controllers/authController";
import { validate } from "../middleware/validateRequest";
import { registerSchema, loginSchema } from "../validation/authSchemas";
import { authLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);

export default router;
