import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats, AdminStats } from "../api/admin";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
        setError("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading admin stats...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  if (!stats) {
    return <div style={{ padding: 20 }}>No stats available.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "#6b7280", maxWidth: 600 }}>
        Create and manage opportunities (hackathons, internships, challenges,
        fests) that will appear in the student portal. Below you can also see
        high-level platform analytics.
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link to="/admin/events/create">
          <button>Create New Event</button>
        </Link>

        <Link to="/admin/events">
          <button>Manage Events</button>
        </Link>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h2>Platform Analytics</h2>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            minWidth: 160,
          }}
        >
          <h3>Total Users</h3>
          <p style={{ fontSize: 24, fontWeight: 600 }}>{stats.userCount}</p>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            minWidth: 160,
          }}
        >
          <h3>Total Events</h3>
          <p style={{ fontSize: 24, fontWeight: 600 }}>{stats.eventCount}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div>
          <h3>Events by Type</h3>
          <ul>
            {stats.eventsByType.map((t) => (
              <li key={t._id || "unknown"}>
                <strong>{t._id || "Unknown"}</strong>: {t.count}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Events by Source</h3>
          <ul>
            {stats.eventsBySource.map((s) => (
              <li key={s._id || "unknown"}>
                <strong>{s._id || "Unknown"}</strong>: {s.count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
