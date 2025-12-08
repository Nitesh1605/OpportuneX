import axiosInstance from "./axiosInstance";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await axiosInstance.post<AuthResponse>("/auth/register", data);
  return res.data;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await axiosInstance.post<AuthResponse>("/auth/login", data);
  return res.data;
}
