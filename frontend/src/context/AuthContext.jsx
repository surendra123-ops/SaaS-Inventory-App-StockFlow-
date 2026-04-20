import { useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi.js";
import { AuthContext } from "./AuthContextValue.js";

const USER_STORAGE_KEY = "stockflow_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await authApi.refresh();
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };
    bootstrap();
  }, []);

  const login = (nextUser) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, login, logout, initializing }), [user, initializing]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
