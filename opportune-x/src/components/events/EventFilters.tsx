// src/components/events/EventFilters.tsx
import React from "react";

interface Props {
  onFilterChange: (filters: any) => void;
}

const EventFilters: React.FC<Props> = ({ onFilterChange }) => {
  return (
    <div style={{ color: "#9ca3af" }}>
      {/* Small placeholder filter UI; extend as needed */}
      <label style={{ marginRight: "0.5rem" }}>
        Type:
        <select onChange={(e) => onFilterChange({ type: e.target.value })} style={{ marginLeft: "0.5rem" }}>
          <option value="All">All</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Internship">Internship</option>
        </select>
      </label>
    </div>
  );
};

export default EventFilters;
