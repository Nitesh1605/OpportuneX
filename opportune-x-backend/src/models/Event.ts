import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
  name: string;
  date: string;
  location: string;
  description: string;
  creator: mongoose.Schema.Types.ObjectId;
}

const EventSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
