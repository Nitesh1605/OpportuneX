import React from "react";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../../hooks/useAlerts";

const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data } = useAlerts(Boolean(token));

  const count =
    (data?.alerts.newMatches.count || 0) +
    (data?.alerts.deadlineReminders.count || 0);

  if (!token) {
    return null;
  }

  return (
    <button
      className="notification-bell"
      onClick={() => navigate("/dashboard#alerts")}
      aria-label="Open alerts"
    >
      <span role="img" aria-hidden="true">
        🔔
      </span>
      {count > 0 && <span className="notification-pill">{count}</span>}
    </button>
  );
};

export default NotificationBell;

