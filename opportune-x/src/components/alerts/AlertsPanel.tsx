import React from "react";
import { AlertsResponse } from "../../api/user";

interface AlertsPanelProps {
  alerts: AlertsResponse["alerts"];
  onSelectEvent?: (eventId: string) => void;
}

const Section: React.FC<{
  title: string;
  subtitle: string;
  items: AlertsResponse["alerts"]["newMatches"]["events"];
  emptyState: string;
  onSelectEvent?: (eventId: string) => void;
}> = ({ title, subtitle, items, emptyState, onSelectEvent }) => (
  <div className="alert-section">
    <div className="alert-section-header">
      <div>
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
      <span className="alert-count">{items.length}</span>
    </div>
    {items.length === 0 ? (
      <p className="alert-empty">{emptyState}</p>
    ) : (
      <ul className="alert-list">
        {items.map((event) => (
          <li key={event._id}>
            <div>
              <strong>{event.title}</strong>
              <p>
                {event.org} •{" "}
                {event.deadline
                  ? new Date(event.deadline).toLocaleDateString()
                  : "Rolling"}
              </p>
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => onSelectEvent?.(event._id)}
            >
              View
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onSelectEvent,
}) => {
  return (
    <div className="alerts-panel">
      <Section
        title="New matches"
        subtitle="Fresh opportunities that match your preferences"
        items={alerts.newMatches.events}
        emptyState="No new matches this week."
        onSelectEvent={onSelectEvent}
      />

      <Section
        title="Deadlines coming up"
        subtitle="Saved events closing soon"
        items={alerts.deadlineReminders.events}
        emptyState="Nothing urgent — nice!"
        onSelectEvent={onSelectEvent}
      />

      <Section
        title="Closing soon"
        subtitle="Public events closing in the next 7 days"
        items={alerts.closingSoon.events}
        emptyState="No deadlines within 7 days."
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
};

export default AlertsPanel;

