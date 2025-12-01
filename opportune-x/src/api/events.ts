import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Get all events
export const getAllEvents = async () => {
  const res = await API.get("/events");
  return res.data;
};

// ✅ Get single event
export const getEventDetails = async (id: string) => {
  const res = await API.get(`/events/${id}`);
  return res.data;
};

// ✅ Create event (Admin)
export const createEvent = async (data: any, token: string) => {
  const res = await API.post("/events", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Update event (Admin)
export const updateEvent = async (id: string, data: any, token: string) => {
  const res = await API.put(`/events/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Delete event (Admin)
export const deleteEvent = async (id: string, token: string) => {
  const res = await API.delete(`/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Save event to user
export const saveEvent = async (eventId: string, token: string) => {
  const res = await API.post(
    "/user/save-event",
    { eventId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ✅ Get saved events for dashboard
export const getSavedEvents = async (token: string) => {
  const res = await API.get("/user/saved-events", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
