import React from "react";
import { Navigate } from "react-router-dom";
import { User } from "../types";

interface ProtectedRouteProps {
  user: User | null;
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  user,
  allowedRoles,
  children,
}) => {

  if (allowedRoles.includes("sso")) {
    if (user) {
      if (user.role == "hotel_manager" || user.role == "receptionist") {
        return <Navigate to="/hotel" />;
      } else if (user.role == "guest") {
        return <Navigate to="/guest" />;
      }
    }
    else if (user===null) {
      return <>{children}</>;
    }
  } 
  if (!user) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/error" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // If the user does not have the necessary role, redirect to a "no access" page or home
    if (user.role == "hotel_manager" || user.role == "receptionist") {
      return <Navigate to="/error" />;
    } else if (user.role == "guest") {
      return <Navigate to="/error" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
