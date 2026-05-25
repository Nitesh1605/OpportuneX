import React, { useEffect, useState } from "react";
import { getAllEvents, deleteEvent } from "../api/events";
import { useNavigate } from "react-router-dom";

const ManageEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data.events || data);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      await deleteEvent(id);
      await loadEvents();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete opportunity");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading) return <div style={{ padding: "2rem" }}>Loading opportunities...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Manage Opportunities</h2>
      {events.length === 0 ? (
        <p>No opportunities created yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {events.map((event: any) => (
            <li key={event._id} className="list-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{event.title}</strong>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#6b7280" }}>{event.org} • {event.location || "Flexible"}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn btn-ghost" onClick={() => navigate(`/admin/events/${event._id}/edit`)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(event._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageEvents;
