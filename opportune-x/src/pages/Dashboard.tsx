import React, { useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";
import { getSavedEvents } from "../api/events";
import { getPreferences, updatePreferences } from "../api/user";

const ALL_TYPES = ["Hackathon", "Internship", "Challenge", "Fest", "Other"];

const Dashboard: React.FC = () => {
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [preferredTypes, setPreferredTypes] = useState<string[]>([]);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [saved, prefs] = await Promise.all([
          getSavedEvents(token),
          getPreferences(token).catch(() => ({ preferredTypes: [] })),
        ]);
        setSavedEvents(saved || []);
        setPreferredTypes(prefs.preferredTypes || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    load();
  }, []);

  const toggleType = (type: string) => {
    setPreferredTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSavePreferences = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setSavingPrefs(true);
      const resp = await updatePreferences(preferredTypes, token);
      setPreferredTypes(resp.preferredTypes || []);
      alert("Preferences saved");
    } catch (err) {
      console.error("Error saving preferences:", err);
      alert("Failed to save preferences");
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2>Your Dashboard</h2>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Alert preferences</h3>
        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          Choose what types of opportunities you care about. We'll highlight these on
          the homepage.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.5rem" }}>
          {ALL_TYPES.map((type) => {
            const checked = preferredTypes.includes(type);
            return (
              <label key={type} style={{ fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleType(type)}
                  style={{ marginRight: 4 }}
                />
                {type}
              </label>
            );
          })}
        </div>

        <button
          className="btn btn-primary"
          style={{ marginTop: "0.75rem" }}
          onClick={handleSavePreferences}
          disabled={savingPrefs}
        >
          {savingPrefs ? "Saving..." : "Save preferences"}
        </button>
      </section>

      <section>
        <h3>Your Saved Events</h3>
        {savedEvents.length === 0 ? (
          <p>No saved events yet.</p>
        ) : (
          savedEvents.map((event) => (
            <EventCard key={event._id} event={event} saved={true} />
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
