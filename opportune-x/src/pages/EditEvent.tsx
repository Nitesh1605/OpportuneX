import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventDetails, updateEvent } from "../api/events";
import EventForm from "../components/events/EventForm";

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await getEventDetails(id);
        setEvent(data);
      } catch (err) {
        console.error("Failed to load event details:", err);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (payload: any) => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in as admin to edit events");

    try {
      setError(null);
      await updateEvent(id, payload);
      alert("Opportunity updated successfully!");
      navigate(`/events/${id}`);
    } catch (err: any) {
      console.error("Update event error:", err);
      setError(err?.response?.data?.msg || "Failed to update opportunity");
    }
  };

  if (!event) return <div style={{ padding: "2rem" }}>Loading opportunity details...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Edit Opportunity</h2>
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
      <EventForm initialData={event} onSubmit={handleSubmit} submitLabel="Update Opportunity" />
    </div>
  );
};

export default EditEvent;
