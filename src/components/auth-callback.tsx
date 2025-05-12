import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../lib/auth-service";
import { toast } from "sonner";

export const AuthCallback: React.FC = () => {
  const { isLoading, login } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const handleCallback = async () => {
      console.log("Starting auth callback handling...");
      try {
        // Get query parameters from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const error = params.get("error");

        console.log("URL params:", {
          token: token ? "present" : "missing",
          error,
        });

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

        console.log("Token received, storing in localStorage...");
        // Store token in localStorage
        localStorage.setItem("auth_token", token);

        console.log("Validating token with backend...");
        // Call backend to get user data
        const response = await fetch("/api/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Validation response status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Validation failed:", errorText);
          throw new Error(`Failed to validate token: ${errorText}`);
        }

        const { data } = await response.json();
        console.log("User data received:", { id: data.id, email: data.email });

        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          picture: data.picture,
          accessToken: token,
        };

        console.log("Updating auth context...");
        try {
          // Update auth context with the user data
          await login();
          console.log("Auth context updated successfully");
        } catch (loginError) {
          console.error("Error during login:", loginError);
          throw loginError;
        }

        setStatus("success");

        // Redirect to main page after a short delay
        console.log("Scheduling redirect...");
        setTimeout(() => {
          console.log("Redirecting to main page...");
          window.location.href = "/";
        }, 1500);
      } catch (error) {
        console.error("Error handling auth callback:", error);
        toast.error("Authentication failed");
        setStatus("error");
      }
    };

    // Immediately handle the callback, don't wait for isLoading
    console.log("Auth state:", { isLoading });
    handleCallback();
  }, []); // Remove isLoading and login from dependencies

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
