import React from "react";
import EventCard from "./EventCard";

const EventList: React.FC<{ events: any[]; savedEvents: string[] }> = ({
  events,
  savedEvents,
}) => {
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
