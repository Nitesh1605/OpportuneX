// src/types/express.d.ts
// This is a TypeScript declaration file — DO NOT import it at runtime.

import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      // payload we attach on successful token verification
      user?: JwtPayload & { id?: string }; 
    }
  }
}
export {}; // make this file a module (prevents global augmentation leaking in some configs)
