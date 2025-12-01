import React, { useEffect, useState } from "react";
import EventList from "../components/events/EventList";
import EventFilters, { Filters } from "../components/events/EventFilters";
import { getAllEvents, getSavedEvents } from "../api/events";
import { getPreferences } from "../api/user";

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [preferredTypes, setPreferredTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all events
        const data = await getAllEvents();
        setEvents(data);
        setFilteredEvents(data);

        // Load saved events (only if user logged in)
        const token = localStorage.getItem("token");
        if (token) {
          const [saved, prefs] = await Promise.all([
            getSavedEvents(token),
            getPreferences(token).catch(() => ({ preferredTypes: [] })),
          ]);
          const ids = (saved || []).map((ev: any) => ev._id);
          setSavedEvents(ids);
          setPreferredTypes(prefs.preferredTypes || []);
        }
      } catch (err) {
        console.error("Error loading events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleFilterChange = (filters: Filters) => {
    let next = [...events];

    // Filter by type (e.g. Hackathon, Internship) if present
    if (filters.type && filters.type !== "All") {
      next = next.filter((ev) => {
        const evType = (ev.type || "").toLowerCase();
        return evType === filters.type?.toLowerCase();
      });
    }

    // Text search on title/org
    if (filters.search) {
      const term = filters.search.toLowerCase();
      next = next.filter((ev) => {
        const title = (ev.title || "").toLowerCase();
        const org = (ev.org || "").toLowerCase();
        return title.includes(term) || org.includes(term);
      });
    }

    // Filter by source platform (contains)
    if (filters.source) {
      const term = filters.source.toLowerCase();
      next = next.filter((ev) => {
        const src = (ev.source || "").toLowerCase();
        return src.includes(term);
      });
    }

    setFilteredEvents(next);
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const recommendedEvents =
    preferredTypes.length > 0
      ? events.filter((ev) =>
          ev.type && preferredTypes.includes(String(ev.type))
        )
      : [];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">All Opportunities</h2>
        <p className="page-subtitle">
          Browse hackathons, internships, challenges and fests in one place.
        </p>
      </div>

      <div className="events-layout">
        <aside className="events-filters">
          <EventFilters onFilterChange={handleFilterChange} />
        </aside>

        <section className="events-list">
          {preferredTypes.length > 0 && recommendedEvents.length > 0 && (
            <section style={{ marginBottom: "1.5rem" }}>
              <h3>Recommended for you</h3>
              <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                Based on your preferences (set in Dashboard).
              </p>
              <EventList events={recommendedEvents} savedEvents={savedEvents} />
            </section>
          )}

          {filteredEvents.length === 0 ? (
            <p>No events match your filters yet.</p>
          ) : (
            <EventList events={filteredEvents} savedEvents={savedEvents} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Events;
