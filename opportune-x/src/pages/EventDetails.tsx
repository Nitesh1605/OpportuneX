import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventDetails } from "../api/events";
import LinkedInPostModal from "../components/events/LinkedInPostModal";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getEventDetails(id);
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading details...</div>;
  if (!event) return <div style={{ padding: "2rem" }}>Opportunity not found.</div>;

  const orgName = event.org || event.organization || "the organizing team";

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>{event.title}</h2>
      <p style={{ color: "#6b7280", margin: "0.5rem 0" }}>Organized by {orgName}</p>
      
      <div style={{ display: "flex", gap: "10px", margin: "1rem 0", fontSize: "0.9rem" }}>
        <span className="event-badge">{event.type || "Opportunity"}</span>
        <span className="event-badge" style={{ background: "#e5e7eb", color: "#374151" }}>{event.mode || "Flexible"}</span>
      </div>

      {event.description && (
        <div style={{ margin: "2rem 0", lineHeight: "1.6" }}>
          <h3>About the Opportunity</h3>
          <p>{event.description}</p>
        </div>
      )}

      <div style={{ background: "#f3f4f6", padding: "1rem", borderRadius: "8px", margin: "1.5rem 0", fontSize: "0.9rem" }}>
        {event.location && <p><strong>Location:</strong> {event.location}</p>}
        {event.deadline && <p><strong>Deadline:</strong> {new Date(event.deadline).toLocaleDateString()}</p>}
        {event.tags && event.tags.length > 0 && <p><strong>Tags:</strong> {event.tags.join(", ")}</p>}
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "2rem" }}>
        {event.applyUrl && (
          <button
            onClick={() => window.open(event.applyUrl, "_blank", "noopener,noreferrer")}
            style={{ padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            Apply Now
          </button>
        )}

        <button
          onClick={() => setShowLinkedInModal(true)}
          style={{ padding: "10px 20px", background: "#0a66c2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Generate LinkedIn Post
        </button>
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

export default EventDetails;
