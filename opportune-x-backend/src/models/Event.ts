import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  type: string;
  organization: string;
  mode: string;
  location: string;
  deadline: string;
  tags?: string[];
  description?: string;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    organization: { type: String, required: true },
    mode: { type: String, required: true },
    location: { type: String, required: true },
    deadline: { type: String, required: true },
    tags: [String],
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>("Event", eventSchema);
