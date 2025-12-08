import axiosInstance from "./axiosInstance";
import { Event } from "../types/Event";

export interface AlertPreferencesPayload {
  newMatches: boolean;
  weeklyDigest: boolean;
  deadlineReminderDays: number;
  lookbackDays: number;
}

export interface AlertsResponse {
  alerts: {
    newMatches: { count: number; events: Event[] };
    deadlineReminders: { count: number; events: Event[] };
    closingSoon: { count: number; events: Event[] };
  };
  preferences: AlertPreferencesPayload;
}

export const getProfile = async () => {
  const res = await axiosInstance.get("/user/profile");
  return res.data;
};

export const saveEvent = async (eventId: string) => {
  const res = await axiosInstance.post("/user/save-event", { eventId });
  return res.data;
};

export const removeSavedEvent = async (eventId: string) => {
  const res = await axiosInstance.delete(`/user/save-event/${eventId}`);
  return res.data;
};

export const getPreferences = async () => {
  const res = await axiosInstance.get("/user/preferences");
  return res.data as { preferredTypes: string[] };
};

export const updatePreferences = async (preferredTypes: string[]) => {
  const res = await axiosInstance.put("/user/preferences", { preferredTypes });
  return res.data as { preferredTypes: string[] };
};

export const getAlertPreferences = async () => {
  const res = await axiosInstance.get("/user/alerts/preferences");
  return res.data as AlertPreferencesPayload;
};

export const updateAlertPreferences = async (
  payload: Partial<AlertPreferencesPayload>
) => {
  const res = await axiosInstance.put("/user/alerts/preferences", payload);
  return res.data as AlertPreferencesPayload;
};

export const getAlerts = async () => {
  const res = await axiosInstance.get("/user/alerts");
  return res.data as AlertsResponse;
};

export const updateProfile = async (data: { name?: string; email?: string; password?: string }) => {
  const response = await axiosInstance.put("/user/profile", data);
  return response.data;
};
