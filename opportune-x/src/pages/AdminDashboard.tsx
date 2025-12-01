import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "#6b7280", maxWidth: 600 }}>
        Create and manage opportunities (hackathons, internships, challenges,
        fests) that will appear in the student portal.
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link to="/admin/events/create">
          <button>Create New Event</button>
        </Link>

        <Link to="/admin/events">
          <button>Manage Events</button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
