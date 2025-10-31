"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  userId: string;
  email: string;
  userType: "CUSTOMER" | "SELLER";
  name?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isSeller: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function refreshUser() {
    setLoading(true);
    try {
      const res = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return null;
      }
      const data = await res.json();
      setUser(data);
      console.log(data);
      return data;
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  async function login(credentials: { email: string; password: string }) {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      const body = await res.json();
      if (!res.ok) {
        return { ok: false, message: body?.message || "Login Failed" };
      }

      const refreshedUser = await refreshUser();

      if (refreshedUser?.userType === "SELLER")
        router.push("/seller/dashboard");
      else router.push("/home");

      return { ok: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { ok: false, message: err || "Login Failed" };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const isSeller = user?.userType === "SELLER";
  const isCustomer = user?.userType === "CUSTOMER";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isSeller,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
