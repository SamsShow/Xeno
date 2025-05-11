import React, { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Login } from "./login";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state if auth is still initializing
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, show login component
  if (!isAuthenticated) {
    return <Login />;
  }

  // If authenticated, render the children
  return <>{children}</>;
};
