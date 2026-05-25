import React, { useEffect, useState } from "react";
import EventList from "../components/events/EventList";
import { Event } from "../types/Event";
import { getAllEvents, getSavedEvents } from "../api/events";

const MODES = ["All", "Remote", "Hybrid", "In-Person"];

const Jobs: React.FC = () => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("All");
  const [jobs, setJobs] = useState<Event[]>([]);
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
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents({
          type: "Job",
          mode: mode === "All" ? undefined : mode,
          search: search || undefined,
        }, { includeMeta: false });
        setJobs(Array.isArray(data) ? data : data?.events ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [search, mode]);

  return (
    <div>
      <div className="category-hero jobs-hero">
        <div className="category-hero-icon">💼</div>
        <h1 className="category-hero-title">Jobs</h1>
        <p className="category-hero-subtitle">Full-time roles at top companies — with live apply links.</p>
      </div>

      <div className="category-filters-row">
        <input
          id="jobs-search"
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
              id={`jobs-mode-${m.toLowerCase().replace(/\s/g, "-")}`}
              className={`mode-pill ${mode === m ? "mode-pill-active" : ""}`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="category-results-meta">
        {loading ? <span>Loading...</span> : <span>{jobs.length} job{jobs.length !== 1 ? "s" : ""} found</span>}
      </div>

      {!loading && jobs.length === 0 ? (
        <div className="category-empty"><p>No jobs match your search.</p></div>
      ) : (
        <EventList events={jobs} savedEvents={savedEventIds} />
      )}
    </div>
  );
};

export default Jobs;
