import React, { useEffect, useState } from "react";
import EventList from "../components/events/EventList";
import EventFilters, { Filters } from "../components/events/EventFilters";
import { Event } from "../types/Event";
import { getAllEvents, getSavedEvents } from "../api/events";

const Events: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({ type: "All", mode: "All", search: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchSaved = async () => {
      if (!token) return;
      try {
        const data = await getSavedEvents();
        setSavedEventIds((data || []).map((e: Event) => e._id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSaved();
  }, [token]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents({
          type: filters.type === "All" ? undefined : filters.type,
          mode: filters.mode === "All" ? undefined : filters.mode,
          search: filters.search || undefined,
        }, { includeMeta: false });
        setAllEvents(data.events || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, [filters]);

  if (loading && allEvents.length === 0) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">All Opportunities</h2>
        <p className="page-subtitle">Browse hackathons, internships, challenges and fests in one place.</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <button className={`btn ${showFilters ? "btn-primary" : "btn-ghost"}`} onClick={() => setShowFilters(!showFilters)}>
          🔍 {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="events-layout" style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {showFilters && (
          <aside className="events-filters" style={{ flex: "1 1 250px" }}>
            <EventFilters onFilterChange={setFilters} initial={filters} />
          </aside>
        )}
        <section className="events-list" style={{ flex: "3 1 600px" }}>
          {allEvents.length === 0 ? <p>No opportunities found.</p> : <EventList events={allEvents} savedEvents={savedEventIds} />}
        </section>
      </div>
    </div>
  );
};

export default Events;
