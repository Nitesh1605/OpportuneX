// src/components/events/EventList.tsx
import React from "react";
import EventCard from "./EventCard";

interface EventItem {
  _id: string;
  name?: string;
  title?: string;
  date?: string;
  location?: string;
  description?: string;
  tags?: string[];
}

interface Props {
  events: EventItem[];
}

const EventList: React.FC<Props> = ({ events }) => {
  return (
    <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      {events.map((ev) => (
        <EventCard key={ev._id} event={ev} />
      ))}
    </div>
  );
};

export default EventList;
