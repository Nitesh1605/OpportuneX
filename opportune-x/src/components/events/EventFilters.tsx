// src/components/events/EventFilters.tsx
import React, { useState } from "react";

export interface Filters {
  type?: string;
  mode?: string;
  search?: string;
  source?: string;
}

const EventFilters: React.FC<{ onFilterChange?: (f: Filters) => void }> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<Filters>({ type: "All", mode: "All", search: "", source: "" });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };
    setFilters(next);
    onFilterChange?.(next);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div>
        <label>Type</label>
        <select name="type" value={filters.type} onChange={handleChange}>
          <option>All</option>
          <option>Hackathon</option>
          <option>Internship</option>
          <option>Challenge</option>
          <option>Fest</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label>Search</label>
        <input name="search" value={filters.search} onChange={handleChange} placeholder="Search title or org" />
      </div>
      <div>
        <label>Source platform</label>
        <input
          name="source"
          value={filters.source}
          onChange={handleChange}
          placeholder="e.g. Unstop, LinkedIn"
        />
      </div>
    </div>
  );
};

export default EventFilters;
