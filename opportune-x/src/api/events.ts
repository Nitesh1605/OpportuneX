import axiosInstance from "./axiosInstance";
import { Event } from "../types/Event";

export interface EventQueryParams {
  type?: string;
  mode?: string;
  source?: string;
  search?: string;
  tags?: string[];
  deadlineFrom?: string;
  deadlineTo?: string;
  preferredTypes?: string[];
  featured?: boolean;
  limit?: number;
  sortBy?: "deadline" | "newest" | "featured";
}

export interface EventApiResponse {
  events: Event[];
  meta?: {
    total: number;
    countsByType: Record<string, number>;
    countsBySource: Record<string, number>;
  };
}

const normalizeEventResponse = (payload: any): EventApiResponse => {
  if (Array.isArray(payload)) {
    return { events: payload };
  }

  return payload;
};

export const getAllEvents = async (
  params?: EventQueryParams,
  options: { includeMeta?: boolean } = {}
) => {
  const res = await axiosInstance.get("/events", {
    params: {
      ...params,
      featured: params?.featured ? "true" : undefined,
      preferredTypes: params?.preferredTypes?.join(","),
      tags: params?.tags?.join(","),
      includeMeta: options.includeMeta ? "true" : undefined,
    },
  });

  return normalizeEventResponse(res.data);
};

// ✅ Get single event
export const getEventDetails = async (id: string) => {
  const res = await axiosInstance.get(`/events/${id}`);
  return res.data;
};

// ✅ Create event (Admin)
export const createEvent = async (data: any) => {
  const res = await axiosInstance.post("/events", data);
  return res.data;
};

// ✅ Update event (Admin)
export const updateEvent = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/events/${id}`, data);
  return res.data;
};

// ✅ Delete event (Admin)
export const deleteEvent = async (id: string) => {
  const res = await axiosInstance.delete(`/events/${id}`);
  return res.data;
};

// ✅ Save event to user
export const saveEvent = async (eventId: string) => {
  const res = await axiosInstance.post("/user/save-event", { eventId });
  return res.data;
};

// ✅ Get saved events for dashboard
export const getSavedEvents = async () => {
  const res = await axiosInstance.get("/user/saved-events");
  return res.data;
};
