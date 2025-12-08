
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventDetails } from "../api/events";
import LinkedInPostModal from "../components/events/LinkedInPostModal";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the event ID from the URL
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getEventDetails(id);
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !event) {
    return <div>{error || "Event not found"}</div>;
  }

  const organizationName = event.org || event.organization || "the organizing team";

  const handleApplyClick = () => {
    if (event.applyUrl) {
      window.open(event.applyUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("No apply link available for this opportunity yet.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>{event.title}</h2>
      {organizationName && (
        <p style={{ color: "#6b7280" }}>Organized by {organizationName}</p>
      )}
      {event.type && (
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Type: {event.type}</p>
      )}
      {event.source && (
        <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
          Source:{" "}
          {event.sourceUrl ? (
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#60a5fa" }}
            >
              {event.source}
            </a>
          ) : (
            event.source
          )}
        </p>
      )}
      {event.description && <p style={{ marginTop: "1rem" }}>{event.description}</p>}

      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#6b7280" }}>
        {event.location && (
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        )}
        {event.mode && (
          <p>
            <strong>Mode:</strong> {event.mode}
          </p>
        )}
        {event.deadline && (
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(event.deadline).toLocaleDateString()}
          </p>
        )}
        {event.tags && event.tags.length > 0 && (
          <p>
            <strong>Tags:</strong> {event.tags.join(", ")}
          </p>
        )}
      </div>

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
        {event.applyUrl && (
          <button
            onClick={handleApplyClick}
            style={{
              padding: "10px 14px",
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
            padding: "10px 14px",
            background: "#0a66c2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Generate LinkedIn post
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

export default EventDetails;
