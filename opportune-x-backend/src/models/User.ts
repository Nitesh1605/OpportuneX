// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  savedEvents: mongoose.Types.ObjectId[]; // Adding the savedEvents field
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Define the savedEvents field
});

export default mongoose.model<IUser>("User", UserSchema);
