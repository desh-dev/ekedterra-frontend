"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getUser } from "@/lib/data/client";
import { User } from "@/lib/graphql/types";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  signOut: () => Promise<void>;
  error: string | null;
  isAdmin: boolean;
  isAgent: boolean;
  isUser: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //   const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const [isUser, setIsUser] = useState(true);

  useEffect(() => {
    const getClaims = async () => {
      try {
        setError(null);
        const supabase = createClient();
        setLoading(true);
        const { data, error } = await supabase.auth.getClaims();
        if (error) throw error;
        if (data?.claims) {
          // Fetch roles when session changes
          const user: User = await getUser(data.claims.sub);
          setUser(user);
          setIsAdmin(user.roles.some((role) => role.role === "admin"));
          setIsAgent(user.roles.some((role) => role.role === "agent"));
          setIsUser(
            !user.roles.some((role) => role.role === "admin") &&
              !user.roles.some((role) => role.role === "agent")
          );
        } else {
          setIsAdmin(false);
          setIsAgent(false);
          setIsUser(true);
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    // Set up auth state listener

    // Check for existing session
    getClaims();
  }, [user]);

  const signOut = async () => {
    try {
      const supabase = createClient();
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error: unknown) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        signOut,
        isAdmin,
        isAgent,
        isUser,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
