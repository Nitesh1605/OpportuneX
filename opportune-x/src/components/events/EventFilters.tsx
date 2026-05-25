import React from "react";

export interface Filters {
  type?: string;
  mode?: string;
  search?: string;
}

interface Props {
  onFilterChange: (f: Filters) => void;
  initial: Filters;
}

const EventFilters: React.FC<Props> = ({ onFilterChange, initial }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    // Notify the parent component of the filter changes immediately
    onFilterChange({
      ...initial,
      [name]: value,
    });
  };

  return (
    <div className="filters-container" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h3 className="filters-title" style={{ margin: 0 }}>Filter Opportunities</h3>

      <div>
        <label className="label" htmlFor="search">Search</label>
        <input
          id="search"
          name="search"
          className="input"
          value={initial.search || ""}
          onChange={handleChange}
          placeholder="Search by title or organization"
        />
      </div>

      <div>
        <label className="label" htmlFor="type">Opportunity Type</label>
        <select
          id="type"
          name="type"
          className="select"
          value={initial.type || "All"}
          onChange={handleChange}
        >
          <option value="All">All Types</option>
          <option value="Hackathon">Hackathons</option>
          <option value="Internship">Internships</option>
          <option value="Challenge">Challenges</option>
          <option value="Fest">Fests</option>
          <option value="Other">Others</option>
        </select>
      </div>

      <div>
        <label className="label" htmlFor="mode">Mode</label>
        <select
          id="mode"
          name="mode"
          className="select"
          value={initial.mode || "All"}
          onChange={handleChange}
        >
          <option value="All">All Modes</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>
    </div>
  );
};

export default EventFilters;
