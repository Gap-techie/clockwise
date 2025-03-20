import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type UserRole = "employee" | "admin" | null;

interface User {
  id: string;
  name: string;
  role: string;
  email?: string;
  employee_id?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if there's an active session
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Session check:", sessionData);

        if (sessionData?.session) {
          // Get user data from our users table
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", sessionData.session.user.id)
            .single();

          if (error) {
            console.error("User data fetch error:", error);
            throw error;
          }

          if (userData) {
            console.log("User data found:", userData);
            setUser(userData);
            setIsAuthenticated(true);
          }
        } else {
          console.log("No active session found");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Session check failed", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Get user data from our users table
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!error && data) {
            setUser(data);
            setIsAuthenticated(true);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAuthenticated(false);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
