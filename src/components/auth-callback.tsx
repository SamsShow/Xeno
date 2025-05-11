import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../lib/auth-service";
import { toast } from "sonner";

export const AuthCallback: React.FC = () => {
  const { isLoading } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get query parameters from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (error) {
          console.error("Authentication error:", error);
          toast.error(`Authentication failed: ${error}`);
          setStatus("error");
          return;
        }

        if (!token) {
          console.error("No token received");
          toast.error("Authentication failed: No token received");
          setStatus("error");
          return;
        }

        // Store token in localStorage
        localStorage.setItem("auth_token", token);

        // Call backend to get user data
        const response = await fetch("/api/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to validate token");
        }

        const { data } = await response.json();
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          picture: data.picture,
          accessToken: token,
        };

        // Update auth context with the user data
        // In a real implementation, we would update the context
        // Here we'll reload the app which will trigger the auth init
        setStatus("success");

        // Redirect to main page after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } catch (error) {
        console.error("Error handling auth callback:", error);
        toast.error("Authentication failed");
        setStatus("error");
      }
    };

    if (!isLoading) {
      handleCallback();
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {status === "loading" && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Completing authentication...</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="bg-green-100 text-green-800 p-4 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-800 font-medium mb-2">
            Authentication Successful
          </p>
          <p className="text-gray-600">Redirecting you to the dashboard...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="bg-red-100 text-red-800 p-4 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-gray-800 font-medium mb-2">
            Authentication Failed
          </p>
          <p className="text-gray-600 mb-4">
            There was a problem authenticating your account.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Return to Login
          </button>
        </>
      )}
    </div>
  );
};
