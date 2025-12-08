import axiosInstance from "./axiosInstance";

export interface AdminStats {
  userCount: number;
  eventCount: number;
  eventsByType: { _id: string; count: number }[];
  eventsBySource: { _id: string; count: number }[];
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await axiosInstance.get<AdminStats>("/admin/stats");
  return res.data;
};