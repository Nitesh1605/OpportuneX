import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/events";
import EventForm from "../components/events/EventForm";

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in as admin to create events");

    try {
      setError(null);
      await createEvent(payload);
      alert("Opportunity created successfully!");
      navigate("/");
    } catch (err: any) {
      console.error("Create event error:", err);
      setError(err?.response?.data?.msg || "Failed to create opportunity");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Create Opportunity</h2>
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
      <EventForm onSubmit={handleSubmit} submitLabel="Create Opportunity" />
    </div>
  );
};

export default CreateEvent;
