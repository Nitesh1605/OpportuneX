// src/components/routes/AdminRoute.tsx

import React from "react";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const payloadPart = token.split(".")[1];
    const decoded = JSON.parse(atob(payloadPart));

    if (!decoded?.isAdmin) {
      return <Navigate to="/" />;
    }
  } catch (e) {
    console.error("Invalid token payload", e);
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
