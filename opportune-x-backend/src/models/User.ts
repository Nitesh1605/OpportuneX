
import mongoose, { Schema, Document } from "mongoose";

export interface AlertPreferences {
  newMatches: boolean;
  weeklyDigest: boolean;
  deadlineReminderDays: number;
  lookbackDays: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  savedEvents?: mongoose.Types.ObjectId[];
  preferredTypes?: string[];
  alertPreferences?: AlertPreferences;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    preferredTypes: { type: [String], default: [] },
    alertPreferences: {
      newMatches: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
      deadlineReminderDays: { type: Number, default: 3 },
      lookbackDays: { type: Number, default: 7 },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
