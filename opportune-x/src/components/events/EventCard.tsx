// src/components/events/EventCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface EventItem {
  _id: string;
  name?: string;
  title?: string;
  date?: string;
  location?: string;
  description?: string;
  tags?: string[];
}

const EventCard: React.FC<{ event: EventItem }> = ({ event }) => {
  const title = event.title || event.name || "Untitled event";

  return (
    <div
      style={{
        background: "rgba(15,23,42,0.95)",
        border: "1px solid rgba(148,163,184,0.2)",
        padding: "1rem",
        borderRadius: "0.75rem",
        color: "#e5e7eb",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".5rem" }}>
        <strong>{title}</strong>
        <span style={{ fontSize: ".85rem", color: "#9ca3af" }}>{event.date || ""}</span>
      </div>

      <div style={{ marginBottom: ".5rem", color: "#9ca3af", fontSize: ".9rem" }}>
        {event.location || "Location not specified"}
      </div>

      <p style={{ fontSize: ".9rem", color: "#d1d5db" }}>{event.description?.slice(0, 120) || ""}</p>

      <div style={{ marginTop: ".75rem" }}>
        <Link to={`/events/${event._id}`} style={{ color: "#60a5fa", textDecoration: "none" }}>
          View details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
