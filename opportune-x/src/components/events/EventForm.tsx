import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const EventForm = () => {
  const [event, setEvent] = useState({
    name: "",
    location: "",
    date: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/events", event);
      console.log(response.data); // Handle the response as needed (e.g., show success message)
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Event Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={event.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={event.location}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={event.date}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventForm;
