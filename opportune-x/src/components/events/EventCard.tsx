import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { saveEvent } from "../../api/events";
import LinkedInPostModal from "./LinkedInPostModal";

export interface EventCardProps {
  event: any;
  savedEvents?: string[];
  saved?: boolean; // ✅ allow Dashboard to pass saved={true}
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  savedEvents = [],
  saved,
}) => {
  const initialSaved =
    typeof saved === "boolean"
      ? saved
      : savedEvents.includes(event._id || event.id);

  const [isSaved, setIsSaved] = useState<boolean>(initialSaved);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);

  // if saved prop changes from parent, update local state
  useEffect(() => {
    if (typeof saved === "boolean") {
      setIsSaved(saved);
    }
  }, [saved]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must login first!");
        return;
      }

      await saveEvent(event._id || event.id, token);
      setIsSaved(true);
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Failed to save event");
    }
  };

  const organizationName = event.org || event.organization || "the organizing team";

  const handleApplyClick = () => {
    if (event.applyUrl) {
      window.open(event.applyUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("No apply link available for this opportunity yet.");
    }
  };

  return (
    <div className="event-card">
      <h3>
        <Link to={`/events/${event._id || event.id}`}>{event.title}</Link>
      </h3>
      {event.type && (
        <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{event.type}</p>
      )}
      {event.source && (
        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
          via {event.source}
        </p>
      )}
      {event.description && <p>{event.description}</p>}
      {(event.deadline || event.date) && (
        <p>
          <strong>Deadline:</strong> {event.deadline || event.date}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button
          onClick={handleSave}
          disabled={isSaved}
          style={{
            padding: "10px",
            background: isSaved ? "#6b7280" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isSaved ? "not-allowed" : "pointer",
          }}
        >
          {isSaved ? "Saved" : "Save Event"}
        </button>

        {event.applyUrl && (
          <button
            onClick={handleApplyClick}
            style={{
              padding: "10px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Apply now
          </button>
        )}

        <button
          onClick={() => setShowLinkedInModal(true)}
          style={{
            padding: "10px",
            background: "#0a66c2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          LinkedIn post
        </button>
      </div>

      {showLinkedInModal && (
        <LinkedInPostModal
          event={{ title: event.title, organization: organizationName }}
          onClose={() => setShowLinkedInModal(false)}
        />
      )}
    </div>
  );
};

export default EventCard;
