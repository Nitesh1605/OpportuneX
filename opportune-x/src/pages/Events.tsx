import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EventList from "../components/events/EventList";
import EventFilters, { Filters } from "../components/events/EventFilters";
import { Event } from "../types/Event";
import { EventQueryParams, getAllEvents, getSavedEvents } from "../api/events";
import { getPreferences } from "../api/user";

const Events: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    type: "All",
    mode: "All",
  });
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const queryFilters: EventQueryParams = useMemo(() => {
    return {
      type: filters.type === "All" ? undefined : filters.type,
      mode: filters.mode === "All" ? undefined : filters.mode,
      source: filters.source || undefined,
      search: filters.search || undefined,
      deadlineFrom: filters.deadlineFrom || undefined,
      deadlineTo: filters.deadlineTo || undefined,
      tags: filters.tags && filters.tags.length > 0 ? filters.tags : undefined,
      sortBy: "deadline",
    };
  }, [filters]);

  const eventsQuery = useQuery({
    queryKey: ["events", queryFilters],
    queryFn: () => getAllEvents(queryFilters, { includeMeta: true }),
    placeholderData: (previousData) => previousData,
  });

  const savedEventsQuery = useQuery({
    queryKey: ["saved-events"],
    queryFn: getSavedEvents,
    enabled: Boolean(token),
  });

  const preferencesQuery = useQuery({
    queryKey: ["preferred-types"],
    queryFn: getPreferences,
    enabled: Boolean(token),
  });

  const recommendedQuery = useQuery({
    queryKey: [
      "recommended-events",
      preferencesQuery.data?.preferredTypes ?? [],
    ],
    queryFn: () =>
      getAllEvents(
        {
          preferredTypes: preferencesQuery.data?.preferredTypes ?? [],
          limit: 6,
          sortBy: "featured",
        },
        { includeMeta: false }
      ),
    enabled:
      Boolean(token) &&
      Boolean(preferencesQuery.data?.preferredTypes?.length),
  });

  const savedEventIds = useMemo(
    () => (savedEventsQuery.data || []).map((event: Event) => event._id),
    [savedEventsQuery.data]
  );

  if (eventsQuery.isPending) {
    return <div>Loading events...</div>;
  }

  if (eventsQuery.error) {
    return <div>Failed to load events. Please try again later.</div>;
  }

  const allEvents = eventsQuery.data?.events ?? [];
  const meta = eventsQuery.data?.meta;
  const recommendedEvents = recommendedQuery.data?.events ?? [];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">All Opportunities</h2>
        <p className="page-subtitle">
          Browse hackathons, internships, challenges and fests in one place.
        </p>
        {meta && (
          <p className="page-meta">
            Showing {meta.total} results. Top sources:{" "}
            {Object.entries(meta.countsBySource || {})
              .slice(0, 3)
              .map(([sourceName, count]) => `${sourceName} (${count})`)
              .join(", ") || "varied"}
          </p>
        )}
      </div>

      <div className="events-layout">
        <aside className="events-filters">
          <EventFilters onFilterChange={setFilters} initial={filters} />
        </aside>

        <section className="events-list">
          {preferencesQuery.data?.preferredTypes?.length ? (
            <section style={{ marginBottom: "1.5rem" }}>
              <h3>Recommended for you</h3>
              <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                Based on your preferences.
              </p>
              {recommendedQuery.isPending ? (
                <p>Loading recommended events...</p>
              ) : recommendedEvents.length === 0 ? (
                <p>No recommended events right now.</p>
              ) : (
                <EventList
                  events={recommendedEvents}
                  savedEvents={savedEventIds}
                />
              )}
            </section>
          ) : (
            token && (
              <section className="recommended-hint">
                <p>
                  Set your preferences in the Dashboard to receive personalized
                  recommendations.
                </p>
              </section>
            )
          )}

          {eventsQuery.isFetching && (
            <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              Updating results...
            </p>
          )}

          {allEvents.length === 0 ? (
            <p>No events match your filters yet.</p>
          ) : (
            <EventList events={allEvents} savedEvents={savedEventIds} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Events;
