import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService, User } from "../lib/auth-service";
import { toast } from "sonner";

// Define the context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  token: null,
  login: async () => {},
  logout: async () => {},
});

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  // Initialize authentication on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.init();
        setUser(currentUser);
        setToken(currentUser?.accessToken || null);
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
        toast.error("Authentication error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login with Google
  const login = async () => {
    try {
      setIsLoading(true);
      const user = await authService.loginWithGoogle();
      setUser(user);
      setToken(user.accessToken);
      toast.success(`Welcome, ${user.name}!`);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);
