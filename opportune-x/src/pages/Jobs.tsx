import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EventList from "../components/events/EventList";
import { Event } from "../types/Event";
import { getAllEvents, getSavedEvents } from "../api/events";

const MODES = ["All", "Remote", "Hybrid", "In-Person"];

const Jobs: React.FC = () => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("All");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const queryFilters = useMemo(
    () => ({
      type: "Job",
      mode: mode === "All" ? undefined : mode,
      search: search || undefined,
    }),
    [search, mode]
  );

  const jobsQuery = useQuery({
    queryKey: ["jobs", queryFilters],
    queryFn: () => getAllEvents(queryFilters, { includeMeta: false }),
    placeholderData: (prev: any) => prev,
  });

  const savedEventsQuery = useQuery({
    queryKey: ["saved-events"],
    queryFn: getSavedEvents,
    enabled: Boolean(token),
  });

  const savedEventIds = useMemo(
    () => (savedEventsQuery.data || []).map((e: Event) => e._id),
    [savedEventsQuery.data]
  );

  const jobs = Array.isArray(jobsQuery.data)
    ? jobsQuery.data
    : (jobsQuery.data as any)?.events ?? [];

  return (
    <div>
      {/* Hero Banner */}
      <div className="category-hero jobs-hero">
        <div className="category-hero-icon">💼</div>
        <h1 className="category-hero-title">Jobs</h1>
        <p className="category-hero-subtitle">
          Full-time engineering, design, and tech roles at top companies —
          with live apply links.
        </p>
      </div>

      {/* Filters Row */}
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

      {/* Results */}
      <div className="category-results-meta">
        {jobsQuery.isFetching ? (
          <span className="category-loading">Loading jobs...</span>
        ) : (
          <span>
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {!jobsQuery.isFetching && jobs.length === 0 ? (
        <div className="category-empty">
          <span>😕</span>
          <p>No jobs match your search. Try different filters.</p>
        </div>
      ) : (
        <EventList events={jobs} savedEvents={savedEventIds} />
      )}
    </div>
  );
};

export default Jobs;
