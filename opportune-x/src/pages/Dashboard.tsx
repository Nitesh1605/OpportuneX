import React, { useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";
import { getSavedEvents } from "../api/events";

const Dashboard: React.FC = () => {
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch only saved events on mount
  useEffect(() => {
    const fetchSavedData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const savedData = await getSavedEvents();
        setSavedEvents(savedData || []);
      } catch (err) {
        console.error("Error loading saved events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedData();
  }, [token]);

  const handleRemovedSavedEvent = (eventId: string) => {
    // Proactively remove the event from our local state array immediately
    setSavedEvents((prev) => prev.filter((event) => event._id !== eventId));
  };

  if (loading) {
    return <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <div className="page-header">
        <h2 className="page-title">Your Dashboard</h2>
        <p className="page-subtitle">
          Manage and view all your bookmarked and saved opportunities in one place.
        </p>
      </div>

      <div className="list-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0 }}>Saved Opportunities</h3>
          <span className="category-results-meta" style={{ margin: 0 }}>
            {savedEvents.length} bookmarked
          </span>
        </div>
        
        {savedEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#6b7280" }}>
            <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>🔖</span>
            <p style={{ margin: 0 }}>You haven't saved any opportunities yet.</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Browse opportunities and click the bookmark icon to save them here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {savedEvents.map((event: any) => (
              <EventCard
                key={event._id}
                event={event}
                saved={true}
                onRemoveSaved={handleRemovedSavedEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
