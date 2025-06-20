import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const session = JSON.parse(localStorage.getItem("session") || "{}");
  const userRole = session.role?.toUpperCase();

  if (!session.token || !userRole) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    switch (userRole) {
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;
      case "SELLER":
        return <Navigate to="/seller/dashboard" replace />;
      case "USER":
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
