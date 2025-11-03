import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

const ProtectedRoute = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (user && token) {
    return <Outlet />;
  }

  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
