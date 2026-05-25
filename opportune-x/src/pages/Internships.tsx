import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EventList from "../components/events/EventList";
import { Event } from "../types/Event";
import { getAllEvents, getSavedEvents } from "../api/events";

const MODES = ["All", "Remote", "Hybrid", "In-Person"];

const Internships: React.FC = () => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("All");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const queryFilters = useMemo(
    () => ({
      type: "Internship",
      mode: mode === "All" ? undefined : mode,
      search: search || undefined,
    }),
    [search, mode]
  );

  const internshipsQuery = useQuery({
    queryKey: ["internships", queryFilters],
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

  const internships = Array.isArray(internshipsQuery.data)
    ? internshipsQuery.data
    : (internshipsQuery.data as any)?.events ?? [];

  return (
    <div>
      {/* Hero Banner */}
      <div className="category-hero internships-hero">
        <div className="category-hero-icon">🎓</div>
        <h1 className="category-hero-title">Internships</h1>
        <p className="category-hero-subtitle">
          Paid internships at top tech companies — Microsoft, Meta, Figma and
          more. Apply directly with live links.
        </p>
      </div>

      {/* Filters Row */}
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

      {/* Results */}
      <div className="category-results-meta">
        {internshipsQuery.isFetching ? (
          <span className="category-loading">Loading internships...</span>
        ) : (
          <span>
            {internships.length} internship
            {internships.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {!internshipsQuery.isFetching && internships.length === 0 ? (
        <div className="category-empty">
          <span>😕</span>
          <p>No internships match your search. Try different filters.</p>
        </div>
      ) : (
        <EventList events={internships} savedEvents={savedEventIds} />
      )}
    </div>
  );
};

export default Internships;
