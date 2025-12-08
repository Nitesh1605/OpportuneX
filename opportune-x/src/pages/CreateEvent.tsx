import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/events";

const CreateEvent: React.FC = () => {
  const [title, setTitle] = useState("");
  const [org, setOrg] = useState("");
  const [type, setType] = useState("");
  const [source, setSource] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as admin to create events");
      return;
    }

    if (!title || !org || !applyUrl) {
      setError("Title, organization and apply URL are required");
      return;
    }

    try {
      setError(null);
      const payload = {
        title,
        org,
        type,
        source,
        sourceUrl,
        applyUrl,
        location,
        mode,
        deadline,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        description,
        featured,
      };

      // Token is read from localStorage by axiosInstance, so we only send payload
      await createEvent(payload);
      alert("Event created!");
      navigate("/"); // back to events list
    } catch (err: any) {
      console.error("Create event error:", err);
      const msg = err?.response?.data?.msg || "Failed to create event";
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Create Event</h2>
      {error && <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="auth-card">
        <div className="auth-field">
          <label>Title</label>
          <input
            className="auth-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Organization</label>
          <input
            className="auth-input"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="e.g. Google, Unstop, College name"
          />
        </div>

        <div className="auth-field">
          <label>Type</label>
          <select
            className="auth-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Internship">Internship</option>
            <option value="Challenge">Challenge</option>
            <option value="Fest">Fest</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="auth-field">
          <label>Source platform</label>
          <input
            className="auth-input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. Unstop, LinkedIn, HackerEarth"
          />
        </div>

        <div className="auth-field">
          <label>Source URL</label>
          <input
            className="auth-input"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://www.linkedin.com/..."
          />
        </div>

        <div className="auth-field">
          <label>Apply URL</label>
          <input
            className="auth-input"
            value={applyUrl}
            onChange={(e) => setApplyUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="auth-field">
          <label>Location</label>
          <input
            className="auth-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Mode (Online / Offline)</label>
          <input
            className="auth-input"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Deadline</label>
          <input
            type="date"
            className="auth-input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Tags (comma separated)</label>
          <input
            className="auth-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="hackathon, AI, web"
          />
        </div>

        <div className="auth-field">
          <label>Description</label>
          <textarea
            className="auth-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <label className="preference-row">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Feature this opportunity on the events page
        </label>

        <button className="btn btn-primary" type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
