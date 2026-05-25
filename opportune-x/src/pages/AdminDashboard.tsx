import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats, AdminStats } from "../api/admin";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading admin stats...</div>;
  if (!stats) return <div style={{ padding: 20 }}>No analytics available.</div>;

  return (
    <div style={{ padding: "0 1rem", maxWidth: 800, margin: "2rem auto" }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "#6b7280" }}>Manage student portal opportunities and review site analytics below.</p>

      <div style={{ margin: "1.5rem 0", display: "flex", gap: 12 }}>
        <Link to="/admin/events/create"><button className="btn btn-primary">Create Event</button></Link>
        <Link to="/admin/events"><button className="btn btn-ghost">Manage Events</button></Link>
      </div>

      <hr style={{ margin: "2rem 0", borderColor: "#e5e7eb" }} />

      <h2>Platform Analytics</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "1rem 0" }}>
        {[{ label: "Total Users", val: stats.userCount }, { label: "Total Events", val: stats.eventCount }].map((c) => (
          <div key={c.label} style={{ padding: 16, borderRadius: 8, border: "1px solid #e5e7eb", minWidth: 160, background: "#f9fafb" }}>
            <h4 style={{ margin: 0, color: "#6b7280" }}>{c.label}</h4>
            <p style={{ fontSize: 28, fontWeight: 700, margin: "0.5rem 0 0 0" }}>{c.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", marginTop: "2rem" }}>
        <div>
          <h3>Opportunities by Type</h3>
          <ul>
            {stats.eventsByType.map((t) => <li key={t._id || "unknown"}><b>{t._id || "Other"}s:</b> {t.count}</li>)}
          </ul>
        </div>
        <div>
          <h3>Opportunities by Source</h3>
          <ul>
            {stats.eventsBySource.map((s) => <li key={s._id || "unknown"}><b>{s._id || "Direct"}:</b> {s.count}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
