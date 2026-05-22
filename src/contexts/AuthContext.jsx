import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const AUTH_KEY = "admin-auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = ({ email, password }) => {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedPassword = (password || "").trim();

    const validEmail = "admin@gerejaamin.org";
    const validPassword = "admin123";

    if (normalizedEmail === validEmail && normalizedPassword === validPassword) {
      const loggedInUser = {
        name: "Admin Gereja",
        email: validEmail,
        role: "admin",
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      return { success: true };
    }

    return {
      success: false,
      message: "Email atau password salah.",
    };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}