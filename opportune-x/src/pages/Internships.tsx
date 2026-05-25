import React, { useEffect, useState } from "react";
import EventList from "../components/events/EventList";
import { Event } from "../types/Event";
import { getAllEvents, getSavedEvents } from "../api/events";

const MODES = ["All", "Remote", "Hybrid", "In-Person"];

const Internships: React.FC = () => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("All");
  const [internships, setInternships] = useState<Event[]>([]);
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
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents({
          type: "Internship",
          mode: mode === "All" ? undefined : mode,
          search: search || undefined,
        }, { includeMeta: false });
        setInternships(Array.isArray(data) ? data : data?.events ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, [search, mode]);

  return (
    <div>
      <div className="category-hero internships-hero">
        <div className="category-hero-icon">🎓</div>
        <h1 className="category-hero-title">Internships</h1>
        <p className="category-hero-subtitle">Paid internships at top companies — with live apply links.</p>
      </div>

      <div className="category-filters-row">
        <input
          id="internships-search"
          className="input category-search"
          type="text"
          placeholder="Search by title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="category-mode-pills">
          {MODES.map((m) => (
            <button
              key={m}
              id={`internships-mode-${m.toLowerCase().replace(/\s/g, "-")}`}
              className={`mode-pill ${mode === m ? "mode-pill-active" : ""}`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="category-results-meta">
        {loading ? <span>Loading...</span> : <span>{internships.length} internship{internships.length !== 1 ? "s" : ""} found</span>}
      </div>

      {!loading && internships.length === 0 ? (
        <div className="category-empty"><p>No internships match your search.</p></div>
      ) : (
        <EventList events={internships} savedEvents={savedEventIds} />
      )}
    </div>
  );
};

export default Internships;
