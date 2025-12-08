import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EventCard from "../components/events/EventCard";
import { getSavedEvents } from "../api/events";
import {
  AlertPreferencesPayload,
  getAlertPreferences,
  getPreferences,
  updateAlertPreferences,
  updatePreferences,
} from "../api/user";
import AlertsPanel from "../components/alerts/AlertsPanel";
import { useAlerts } from "../hooks/useAlerts";

const ALL_TYPES = ["Hackathon", "Internship", "Challenge", "Fest", "Other"];

const ALERT_PREF_DEFAULTS: AlertPreferencesPayload = {
  newMatches: true,
  weeklyDigest: false,
  deadlineReminderDays: 3,
  lookbackDays: 7,
};

const Dashboard: React.FC = () => {
  const [preferredTypes, setPreferredTypes] = useState<string[]>([]);
  const [alertPrefs, setAlertPrefs] =
    useState<AlertPreferencesPayload>(ALERT_PREF_DEFAULTS);
  const queryClient = useQueryClient();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

  const alertPrefsQuery = useQuery({
    queryKey: ["alert-preferences"],
    queryFn: getAlertPreferences,
    enabled: Boolean(token),
  });

  const alertsQuery = useAlerts(Boolean(token));

  useEffect(() => {
    if (preferencesQuery.data?.preferredTypes) {
      setPreferredTypes(preferencesQuery.data.preferredTypes);
    }
  }, [preferencesQuery.data]);

  useEffect(() => {
    if (alertPrefsQuery.data) {
      setAlertPrefs(alertPrefsQuery.data);
    }
  }, [alertPrefsQuery.data]);

  const toggleType = (type: string) => {
    setPreferredTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const preferencesMutation = useMutation({
    mutationFn: (types: string[]) => updatePreferences(types),
    onSuccess: (data) => {
      setPreferredTypes(data.preferredTypes);
      queryClient.invalidateQueries({ queryKey: ["preferred-types"] });
    },
  });

  const alertPrefsMutation = useMutation({
    mutationFn: (payload: Partial<AlertPreferencesPayload>) =>
      updateAlertPreferences(payload),
    onSuccess: (data) => {
      setAlertPrefs(data);
      queryClient.invalidateQueries({ queryKey: ["alert-preferences"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const savedEvents = useMemo(
    () => savedEventsQuery.data || [],
    [savedEventsQuery.data]
  );

  const handleRemovedSavedEvent = (eventId: string) => {
    queryClient.setQueryData(["saved-events"], (prev: any) =>
      Array.isArray(prev) ? prev.filter((event) => event._id !== eventId) : prev
    );
  };

  const alertsData = alertsQuery.data?.alerts;

  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto" }}>
      <div className="page-header">
        <h2 className="page-title">Your Dashboard</h2>
        <p className="page-subtitle">
          Track saved events, tune your recommendations and stay ahead of
          deadlines.
        </p>
      </div>

      <div className="dashboard-grid">
        <section className="list-card" id="alerts">
          <h3>Alerts & reminders</h3>
          {alertsQuery.isPending ? (
            <p>Loading alerts...</p>
          ) : alertsData ? (
            <AlertsPanel alerts={alertsData} />
          ) : (
            <p>No alerts yet. Save events and set preferences to get started.</p>
          )}
        </section>

        <section className="list-card">
          <h3>Alert settings</h3>
          <p className="list-item-sub">
            Control how OpportuneX surfaces new matches and deadline reminders.
          </p>

          <div className="preference-group">
            <strong>Opportunity types</strong>
            <div className="preference-grid">
              {ALL_TYPES.map((type) => {
                const checked = preferredTypes.includes(type);
                return (
                  <label key={type} className="preference-pill">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleType(type)}
                    />
                    {type}
                  </label>
                );
              })}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => preferencesMutation.mutate(preferredTypes)}
              disabled={preferencesMutation.isPending}
            >
              {preferencesMutation.isPending ? "Saving..." : "Save types"}
            </button>
          </div>

          <div className="preference-group">
            <strong>Alert cadence</strong>
            <label className="preference-row">
              <input
                type="checkbox"
                checked={alertPrefs.newMatches}
                onChange={(e) =>
                  setAlertPrefs((prev) => ({
                    ...prev,
                    newMatches: e.target.checked,
                  }))
                }
              />
              Show me new matches every week
            </label>
            <label className="preference-row">
              <input
                type="checkbox"
                checked={alertPrefs.weeklyDigest}
                onChange={(e) =>
                  setAlertPrefs((prev) => ({
                    ...prev,
                    weeklyDigest: e.target.checked,
                  }))
                }
              />
              Send me a weekly digest email (soon)
            </label>

            <label className="preference-row">
              Deadline reminder (days)
              <input
                type="number"
                min={1}
                value={alertPrefs.deadlineReminderDays}
                onChange={(e) =>
                  setAlertPrefs((prev) => ({
                    ...prev,
                    deadlineReminderDays: Number(e.target.value),
                  }))
                }
                className="input"
                style={{ maxWidth: 120, marginLeft: "auto" }}
              />
            </label>
            <label className="preference-row">
              New match lookback (days)
              <input
                type="number"
                min={1}
                value={alertPrefs.lookbackDays}
                onChange={(e) =>
                  setAlertPrefs((prev) => ({
                    ...prev,
                    lookbackDays: Number(e.target.value),
                  }))
                }
                className="input"
                style={{ maxWidth: 120, marginLeft: "auto" }}
              />
            </label>

            <button
              className="btn btn-ghost"
              onClick={() => alertPrefsMutation.mutate(alertPrefs)}
              disabled={alertPrefsMutation.isPending}
            >
              {alertPrefsMutation.isPending ? "Saving..." : "Save alert rules"}
            </button>
          </div>
        </section>
      </div>

      <section style={{ marginTop: "2rem" }}>
        <h3>Saved events</h3>
        {savedEvents.length === 0 ? (
          <p>No saved events yet.</p>
        ) : (
          savedEvents.map((event: any) => (
            <EventCard
              key={event._id}
              event={event}
              saved={true}
              onRemoveSaved={handleRemovedSavedEvent}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
