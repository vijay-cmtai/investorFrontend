import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

interface RoleBasedRouteProps {
  allowedRoles: string[];
}
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />;
  }
  if (user) {
    switch (user.role) {
      case "Admin":
        return <Navigate to="/admin" replace />;
      case "Company":
        return <Navigate to="/company/dashboard" replace />;
      case "Associate":
        return <Navigate to="/broker/dashboard" replace />;
      default:
        return <Navigate to="/users/dashboard" replace />;
    }
  }

  return <Navigate to="/auth" replace />;
};

export default RoleBasedRoute;
