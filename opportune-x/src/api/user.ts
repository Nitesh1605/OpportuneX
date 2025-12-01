// src/api/user.ts
import axios from "axios";

const API = "/api/user";

export const getProfile = async (token?: string) => {
  const res = await axios.get(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const saveEvent = async (eventId: string, token?: string) => {
  const res = await axios.post(
    `${API}/save-event`,
    { eventId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const removeSavedEvent = async (eventId: string, token?: string) => {
  const res = await axios.delete(`${API}/save-event/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getPreferences = async (token?: string) => {
  const res = await axios.get(`${API}/preferences`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as { preferredTypes: string[] };
};

export const updatePreferences = async (preferredTypes: string[], token?: string) => {
  const res = await axios.put(
    `${API}/preferences`,
    { preferredTypes },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data as { preferredTypes: string[] };
};
