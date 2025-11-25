// src/types/express.d.ts

import { User } from "../models/User"; // Adjust the path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Adding user to the Request interface
    }
  }
}

