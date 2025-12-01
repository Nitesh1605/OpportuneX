// src/models/Event.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  org: string;
  type?: string; // Hackathon, Internship, Challenge, Fest, etc.
  source?: string; // e.g. Unstop, LinkedIn, HackerEarth
  applyUrl?: string; // external registration link
  mode?: string;
  location?: string;
  deadline?: string | null;
  tags?: string[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    org: { type: String, required: true },
    type: { type: String, default: "" },
    source: { type: String, default: "" },
    applyUrl: { type: String, default: "" },
    mode: { type: String },
    location: { type: String },
    deadline: { type: String, default: null },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
