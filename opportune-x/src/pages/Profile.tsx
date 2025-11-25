// src/pages/Profile.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  location: string;
}

const Profile = () => {
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch saved events for the logged-in user
  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user/saved-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedEvents(response.data);
      } catch (error) {
        console.error("Error fetching saved events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  const handleRemoveEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/user/saved-events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedEvents((prev) => prev.filter((event) => event._id !== eventId)); // Remove from UI
      alert("Event removed from saved list");
    } catch (error) {
      console.error("Error removing saved event:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Profile</h1>
      <h2>Saved Events</h2>
      {savedEvents.length === 0 ? (
        <p>No saved events</p>
      ) : (
        <ul>
          {savedEvents.map((event) => (
            <li key={event._id}>
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <p>{event.date}</p>
              <p>{event.location}</p>
              <button onClick={() => handleRemoveEvent(event._id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
