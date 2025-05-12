import { toast } from "sonner";

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  accessToken: string;
}

// Store the current user in memory
let currentUser: User | null = null;

// Mock Google OAuth response for dev purposes
const mockGoogleResponse = {
  id: "google-123456789",
  name: "Test User",
  email: "test@example.com",
  picture: "https://lh3.googleusercontent.com/a/default-user",
  accessToken: "mock-access-token-xyz",
};

export const authService = {
  // Initialize auth, check for existing session
  init: async (): Promise<User | null> => {
    try {
      // Check for existing token in localStorage
      const savedToken = localStorage.getItem("auth_token");

      if (savedToken) {
        try {
          // Attempt to validate token with backend
          const response = await fetch("/api/auth/validate", {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });

          if (response.ok) {
            // Token is valid
            const result = await response.json();
            const userData = result.data;

            // Create user object with backend data and token
            const user: User = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              picture: userData.picture,
              accessToken: savedToken,
            };

            currentUser = user;
            return user;
          } else {
            // Clear invalid token
            localStorage.removeItem("auth_token");
            return null;
          }
        } catch (error) {
          // Handle network errors
          console.error("Error validating token:", error);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error initializing auth:", error);
      return null;
    }
  },

  // Get the current logged in user
  getCurrentUser: (): User | null => {
    return currentUser;
  },

  // Login with Google
  loginWithGoogle: async (): Promise<User> => {
    try {
      console.log("Attempting to login with Google...");
      // Check if we have a token from the callback
      const savedToken = localStorage.getItem("auth_token");

      if (savedToken) {
        console.log("Token found in localStorage, validating...");
        // Validate the token
        const response = await fetch("/api/auth/validate", {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (response.ok) {
          console.log("Token validation successful");
          const result = await response.json();
          const userData = result.data;

          const user: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            accessToken: savedToken,
          };

          console.log("User authenticated:", user.name);
          currentUser = user;
          return user;
        } else {
          console.error("Token validation failed:", await response.text());
          throw new Error("Token validation failed");
        }
      }

      // Only redirect if we're not already on the callback page
      if (!window.location.pathname.includes("/auth-callback")) {
        console.log("No valid token, redirecting to Google OAuth...");
        window.location.href = "/api/auth/google";
        throw new Error("Redirecting to Google OAuth");
      } else {
        console.log("On callback page but no token found");
        throw new Error("No token available");
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error("Failed to login with Google");
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      // In a real implementation, this would call an API to invalidate the token
      // For this demo, we'll just clear the local state

      // 1. Clear local storage
      localStorage.removeItem("auth_token");

      // 2. Clear user state
      currentUser = null;

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return currentUser !== null;
  },
};
