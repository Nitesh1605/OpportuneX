// src/api/events.ts
import axios from "axios";

const API_BASE = ""; // empty -> uses CRA proxy if configured, otherwise put "http://localhost:5000"

export async function getAllEvents() {
  const res = await axios.get(`${API_BASE}/api/events`);
  return res.data;
}

export async function getEventDetails(id: string) {
  const res = await axios.get(`${API_BASE}/api/events/${id}`);
  return res.data;
}

/* Optionally add saveEvent, getSavedEvents etc. */
export async function saveEvent(eventId: string) {
  const res = await axios.post(`${API_BASE}/api/events/${eventId}/save`);
  return res.data;
}
