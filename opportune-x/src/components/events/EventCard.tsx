import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const EventCard: React.FC<EventCardProps> = ({ event, savedEvents = [], saved, onRemoveSaved }) => {
  const navigate = useNavigate();
  const eventId = event._id || (event as any).id;
  const [isSaved, setIsSaved] = useState<boolean>(saved ?? savedEvents.includes(eventId));
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);

  useEffect(() => {
    if (typeof saved === "boolean") setIsSaved(saved);
  }, [saved]);

  const handleSaveToggle = async () => {
    if (!localStorage.getItem("token")) return navigate("/login");
    try {
      if (isSaved) {
        await removeSavedEvent(eventId);
        setIsSaved(false);
        if (onRemoveSaved) onRemoveSaved(eventId);
      } else {
        await saveEvent(eventId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
      alert("Action failed.");
    }
  };

  const deadlineLabel = event.deadline ? new Date(event.deadline).toLocaleDateString() : "Rolling";
  const orgName = event.org || (event as any).organization || "the organizing team";

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div>
          <h3><Link to={`/events/${eventId}`}>{event.title}</Link></h3>
          <p className="event-meta">{orgName}{event.location ? ` • ${event.location}` : ""}</p>
        </div>
        {event.featured && <span className="event-badge">Featured</span>}
      </div>

      <div className="event-card-body">
        <p className="event-type">{event.type || "Opportunity"} • {event.mode || "Flexible"} • Deadline: {deadlineLabel}</p>
        {event.description && <p className="event-description">{event.description}</p>}
        {event.tags && event.tags.length > 0 && (
          <div className="event-tags">
            {event.tags.slice(0, 4).map((tag) => <span key={tag} className="event-tag">{tag}</span>)}
          </div>
        )}
      </div>

      <div className="event-card-actions" style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
        <button onClick={handleSaveToggle} className={`btn ${isSaved ? "btn-danger" : "btn-primary"}`}>
          {isSaved ? "Remove Bookmark" : "Bookmark"}
        </button>
        {event.applyUrl && (
          <button className="btn btn-success" onClick={() => window.open(event.applyUrl, "_blank", "noopener,noreferrer")}>Apply Now</button>
        )}
        <button className="btn btn-linkedin" onClick={() => setShowLinkedInModal(true)}>Share on LinkedIn</button>
      </div>

      {showLinkedInModal && (
        <LinkedInPostModal
          event={{ title: event.title, organization: orgName, type: event.type, mode: event.mode }}
          onClose={() => setShowLinkedInModal(false)}
        />
      )}
    </div>
  );
};

export default EventCard;
