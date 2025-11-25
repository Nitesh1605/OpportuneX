// src/pages/Events.tsx
import React, { useEffect, useState } from "react";
import EventList from "../components/events/EventList";
import EventFilters from "../components/events/EventFilters"; // optional UI component
import { getAllEvents } from "../api/events";

interface EventItem {
  _id: string;
  title?: string;
  name?: string;
  date?: string;
  location?: string;
  description?: string;
  tags?: string[];
  // add other fields that your backend returns
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getAllEvents()
      .then((data) => {
        setEvents(data || []);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: "1.5rem" }}>
      <h1 style={{ color: "#fff" }}>Events</h1>

      {/* Optional: filter UI (can just render skeleton if not implemented) */}
      <div style={{ marginBottom: "1rem" }}>
        <EventFilters onFilterChange={() => {}} />
      </div>

      <div>
        {loading ? (
          <p style={{ color: "#cbd5e1" }}>Loading events…</p>
        ) : events.length === 0 ? (
          <p style={{ color: "#cbd5e1" }}>No events available</p>
        ) : (
          <EventList events={events} />
        )}
      </div>
    </section>
  );
};

export default Events;
