// src/model/User.ts
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  savedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }] // Array of saved event references
});

export default mongoose.model("User", UserSchema);
