
import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  org: string;
  type?: string;
  source?: string;
  sourceUrl?: string;
  applyUrl?: string;
  mode?: string;
  location?: string;
  deadline?: Date | null;
  tags?: string[];
  description?: string;
  featured?: boolean;
  collectedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    org: { type: String, required: true },
    type: { type: String, default: "" },
    source: { type: String, default: "" },
    sourceUrl: { type: String, default: "" },
    applyUrl: { type: String, default: "" },
    mode: { type: String },
    location: { type: String },
    deadline: { type: Date, default: null },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    collectedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
