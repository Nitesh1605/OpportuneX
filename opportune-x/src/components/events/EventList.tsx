import React from "react";
import EventCard from "./EventCard";
import { Event } from "../../types/Event";

interface EventListProps {
  events: Event[];
  savedEvents: string[];
}

const EventList: React.FC<EventListProps> = ({ events, savedEvents }) => {
  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          savedEvents={savedEvents}
        />
      ))}
    </div>
  );
};

export default EventList;
