import React, { useEffect, useMemo, useState } from "react";

export interface Filters {
  type?: string;
  mode?: string;
  search?: string;
  source?: string;
  tags?: string[];
  deadlineFrom?: string;
  deadlineTo?: string;
}

interface Props {
  onFilterChange?: (f: Filters) => void;
  initial?: Filters;
}

const SOURCE_OPTIONS = [
  "Unstop",
  "LinkedIn",
  "Company site",
  "HackerRank",
  "Devfolio",
  "Other",
];

const INITIAL_FILTERS: Filters = {
  type: "All",
  mode: "All",
  search: "",
  source: "",
  tags: [],
  deadlineFrom: "",
  deadlineTo: "",
};

const EventFilters: React.FC<Props> = ({ onFilterChange, initial }) => {
  const memoInitial = useMemo(
    () => ({ ...INITIAL_FILTERS, ...(initial || {}) }),
    [initial]
  );
  const [filters, setFilters] = useState<Filters>(memoInitial);
  const [tagsInput, setTagsInput] = useState(
    memoInitial.tags?.join(", ") ?? ""
  );

  useEffect(() => {
    setFilters(memoInitial);
    setTagsInput(memoInitial.tags?.join(", ") ?? "");
  }, [memoInitial]);

  const emitChange = (nextFilters: Filters) => {
    setFilters(nextFilters);
    onFilterChange?.(nextFilters);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    emitChange({ ...filters, [name]: value });
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    emitChange({ ...filters, tags });
  };

  const handleClear = () => {
    emitChange(memoInitial);
    setTagsInput("");
  };

  return (
    <div>
      <h3 className="filters-title">Refine results</h3>
      <p className="filters-subtitle">
        Filter by category, mode, source, deadline or tags to zero in on the
        opportunities that matter most.
      </p>

      <div className="filters-grid">
        <div>
          <label className="label" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            name="type"
            className="select"
            value={filters.type}
            onChange={handleChange}
          >
            <option value="All">All</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Internship">Internship</option>
            <option value="Challenge">Challenge</option>
            <option value="Fest">Fest</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="mode">
            Mode
          </label>
          <select
            id="mode"
            name="mode"
            className="select"
            value={filters.mode}
            onChange={handleChange}
          >
            <option value="All">All</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="source">
            Source platform
          </label>
          <select
            id="source"
            name="source"
            className="select"
            value={filters.source}
            onChange={handleChange}
          >
            <option value="">Any</option>
            {SOURCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            name="search"
            className="input"
            value={filters.search}
            onChange={handleChange}
            placeholder="Title or organization"
          />
        </div>

        <div>
          <label className="label" htmlFor="deadlineFrom">
            Deadline from
          </label>
          <input
            type="date"
            id="deadlineFrom"
            name="deadlineFrom"
            className="input"
            value={filters.deadlineFrom}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label" htmlFor="deadlineTo">
            Deadline to
          </label>
          <input
            type="date"
            id="deadlineTo"
            name="deadlineTo"
            className="input"
            value={filters.deadlineTo}
            onChange={handleChange}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label className="label" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            className="input"
            value={tagsInput}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="AI, fintech, design..."
          />
        </div>
      </div>

      <button
        type="button"
        className="btn btn-ghost filters-clear"
        onClick={handleClear}
      >
        Clear filters
      </button>
    </div>
  );
};

export default EventFilters;
