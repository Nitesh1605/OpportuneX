import React, { useEffect, useState } from "react";
import { getAllEvents, deleteEvent } from "../api/events";
import { useNavigate } from "react-router-dom";

const ManageEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvents();
      setEvents(data.events || data);
    } catch (err) {
      console.error("Failed to load events", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as admin.");
      return;
    }

    try {
      // Token is read from localStorage by axiosInstance; we only pass the id
      await deleteEvent(id);
      await loadEvents(); // Refresh list
    } catch (err) {
      console.error("Delete event error", err);
      alert("Failed to delete event");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Manage Events</h2>
      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <ul>
          {events.map((event: any) => (
            <li
              key={event._id}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <div style={{ flex: 1 }}>
                <strong>{event.title}</strong> —{" "}
                {(event.deadline || event.date)
                  ? String(event.deadline || event.date).slice(0, 10)
                  : ""}
                <div style={{ fontSize: 13, color: "#666" }}>
                  {event.org} • {event.location}
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate(`/admin/events/${event._id}/edit`)}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageEvents;
