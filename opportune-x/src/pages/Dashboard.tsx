// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/events/EventCard";

const Dashboard = () => {
  const [savedEvents, setSavedEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/saved-events");
        setSavedEvents(response.data);
      } catch (error) {
        console.error("Error fetching saved events:", error);
      }
    };

    fetchSavedEvents();
  }, []);

  return (
    <div>
      <h2>Your Saved Events</h2>
      {savedEvents.length > 0 ? (
        savedEvents.map((event) => (
          <EventCard key={event._id} event={event} saved={true} />
        ))
      ) : (
        <p>No saved events</p>
      )}
    </div>
  );
};

export default Dashboard;
