import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  year?: string;
  interests?: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    year: String,
    interests: [String],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
