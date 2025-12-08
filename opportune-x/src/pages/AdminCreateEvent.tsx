import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AdminCreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    type: "",
    organization: "",
    mode: "",
    location: "",
    deadline: "",
    description: "",
    link: "",
    tags: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Token is handled by axiosInstance interceptor

      const res = await axiosInstance.post(
        "/events",
        { ...form, tags: form.tags.split(",") }
      );

      alert("Event created successfully!");
      console.log(res.data);
    } catch (err) {
      alert("Failed to create event");
      console.log(err);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create New Event</h2>

      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="type" placeholder="Type" onChange={handleChange} />
      <input name="organization" placeholder="Organization" onChange={handleChange} />
      <input name="mode" placeholder="Mode" onChange={handleChange} />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="deadline" placeholder="Deadline" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange} />
      <input name="link" placeholder="Registration Link" onChange={handleChange} />
      <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />

      <button className="btn btn-primary" onClick={handleSubmit}>
        Create Event
      </button>
    </div>
  );
};

export default AdminCreateEvent;
