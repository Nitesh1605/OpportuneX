// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  savedEvents?: mongoose.Types.ObjectId[];
  preferredTypes?: string[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    preferredTypes: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
