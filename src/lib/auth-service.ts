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
    // In a real implementation, this would check localStorage or cookies
    // and verify the token with the backend
    try {
      const savedToken = localStorage.getItem("auth_token");
      if (savedToken) {
        // In a real app, validate token with backend
        const response = await fetch("/api/auth/validate", {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          currentUser = userData;
          return userData;
        } else {
          // Token invalid, clear it
          localStorage.removeItem("auth_token");
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
      // In a real implementation, this would open Google OAuth flow
      // For this demo, we'll simulate a successful login

      // 1. In production: Redirect to Google OAuth page
      // window.location.href = '/api/auth/google';

      // 2. For demo: simulate successful auth
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Process the response
      const user = mockGoogleResponse;
      currentUser = user;

      // 4. Store token in localStorage (or secure cookie in production)
      localStorage.setItem("auth_token", user.accessToken);

      return user;
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
