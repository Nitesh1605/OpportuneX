import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { saveEvent } from "../../api/events";
import { removeSavedEvent } from "../../api/user";
import LinkedInPostModal from "./LinkedInPostModal";
import { Event } from "../../types/Event";

export interface EventCardProps {
  event: Event;
  savedEvents?: string[];
  saved?: boolean;
  onRemoveSaved?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  savedEvents = [],
  saved,
  onRemoveSaved,
}) => {
  const eventId = event._id || (event as any).id;
  const initialSaved =
    typeof saved === "boolean" ? saved : savedEvents.includes(eventId);

  const [isSaved, setIsSaved] = useState<boolean>(initialSaved);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    if (typeof saved === "boolean") {
      setIsSaved(saved);
    }
  }, [saved]);

  useEffect(() => {
    try {
      const userRaw =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userRaw) {
        const parsed = JSON.parse(userRaw);
        setUserName(parsed?.name);
      }
    } catch {
      setUserName(undefined);
    }
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must login first!");
        return;
      }

      await saveEvent(eventId);
      setIsSaved(true);
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Failed to save event");
    }
  };

  const handleRemove = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must login first!");
        return;
      }

      await removeSavedEvent(eventId);

      if (onRemoveSaved) {
        onRemoveSaved(eventId);
      }

      setIsSaved(false);
    } catch (err) {
      console.error("Error removing saved event:", err);
      alert("Failed to remove saved event");
    }
  };

  const organizationName =
    event.org || (event as any).organization || "the organizing team";

  const handleApplyClick = () => {
    if (event.applyUrl) {
      window.open(event.applyUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("No apply link available for this opportunity yet.");
    }
  };

  const deadlineLabel = event.deadline
    ? new Date(event.deadline).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "Rolling";

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div>
          <h3>
            <Link to={`/events/${eventId}`}>{event.title}</Link>
          </h3>
          <p className="event-meta">
            {organizationName}
            {event.location ? ` • ${event.location}` : ""}
          </p>
        </div>
        {event.featured && <span className="event-badge">Featured</span>}
      </div>

      <div className="event-card-body">
        <p className="event-type">
          {event.type || "Opportunity"} • {event.mode || "Flexible"} • Deadline:{" "}
          {deadlineLabel}
        </p>
        {event.source && (
          <p className="event-source">
            Listed on{" "}
            {event.sourceUrl ? (
              <a href={event.sourceUrl} target="_blank" rel="noreferrer">
                {event.source}
              </a>
            ) : (
              event.source
            )}
          </p>
        )}
        {event.description && (
          <p className="event-description">{event.description}</p>
        )}
        {event.tags && event.tags.length > 0 && (
          <div className="event-tags">
            {event.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="event-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="event-card-actions">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`btn ${isSaved ? "btn-disabled" : "btn-primary"}`}
        >
          {isSaved ? "Saved" : "Save"}
        </button>

        {isSaved && onRemoveSaved && (
          <button className="btn btn-danger" onClick={handleRemove}>
            Remove
          </button>
        )}

        {event.applyUrl && (
          <button className="btn btn-success" onClick={handleApplyClick}>
            Apply now
          </button>
        )}

        <button
          className="btn btn-linkedin"
          onClick={() => setShowLinkedInModal(true)}
        >
          LinkedIn post
        </button>
      </div>

      {showLinkedInModal && (
        <LinkedInPostModal
          event={{
            title: event.title,
            organization: organizationName,
            type: event.type,
            mode: event.mode,
          }}
          userName={userName}
          onClose={() => setShowLinkedInModal(false)}
        />
      )}
    </div>
  );
};

export default EventCard;
