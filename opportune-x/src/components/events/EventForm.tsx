import React, { useState } from "react";

interface EventFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  submitLabel: string;
}

const EventForm: React.FC<EventFormProps> = ({ initialData, onSubmit, submitLabel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    org: initialData?.org || "",
    type: initialData?.type || "",
    source: initialData?.source || "",
    sourceUrl: initialData?.sourceUrl || "",
    applyUrl: initialData?.applyUrl || "",
    location: initialData?.location || "",
    mode: initialData?.mode || "",
    deadline: initialData?.deadline ? initialData.deadline.substring(0, 10) : "",
    tags: initialData?.tags?.join(", ") || "",
    description: initialData?.description || "",
    featured: Boolean(initialData?.featured),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {[{ name: "title", label: "Title" }, { name: "org", label: "Organization" }].map((f) => (
        <div key={f.name} className="auth-field">
          <label>{f.label}</label>
          <input className="auth-input" name={f.name} value={(formData as any)[f.name]} onChange={handleChange} required />
        </div>
      ))}

      <div className="auth-field">
        <label>Type</label>
        <select className="auth-input" name="type" value={formData.type} onChange={handleChange}>
          <option value="">Select type</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Internship">Internship</option>
          <option value="Challenge">Challenge</option>
          <option value="Fest">Fest</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {[{ name: "source", label: "Source Platform" }, { name: "sourceUrl", label: "Source URL" }, { name: "applyUrl", label: "Apply URL" }, { name: "location", label: "Location" }, { name: "mode", label: "Mode" }].map((f) => (
        <div key={f.name} className="auth-field">
          <label>{f.label}</label>
          <input className="auth-input" name={f.name} value={(formData as any)[f.name]} onChange={handleChange} />
        </div>
      ))}

      <div className="auth-field">
        <label>Deadline</label>
        <input type="date" className="auth-input" name="deadline" value={formData.deadline} onChange={handleChange} />
      </div>

      <div className="auth-field">
        <label>Tags (comma separated)</label>
        <input className="auth-input" name="tags" value={formData.tags} onChange={handleChange} placeholder="hackathon, AI, web" />
      </div>

      <div className="auth-field">
        <label>Description</label>
        <textarea className="auth-input" name="description" value={formData.description} onChange={handleChange} rows={4} />
      </div>

      <label className="preference-row" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
        <span>Feature this opportunity on the events page</span>
      </label>

      <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: "1rem" }}>
        {submitLabel}
      </button>
    </form>
  );
};

export default EventForm;
