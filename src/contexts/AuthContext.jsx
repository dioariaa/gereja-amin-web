import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextValue";
import { adminRoles, roleLabels } from "../data/adminAccess";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AUTH_KEY = "admin-auth";
const PROFILE_SELECT = "id, full_name, role_id, is_active, role:roles(id, label)";
const demoAuthEnabled =
  !isSupabaseConfigured || import.meta.env.VITE_ENABLE_DEMO_AUTH === "true";

const demoUsers = [
  {
    name: "Super Admin Gereja",
    email: "admin@gerejaamin.org",
    password: "admin123",
    role: adminRoles.superAdmin,
  },
  {
    name: "Sekretaris Jemaat",
    email: "sekretaris@gerejaamin.org",
    password: "admin123",
    role: adminRoles.sekretaris,
  },
  {
    name: "Bendahara Gereja",
    email: "bendahara@gerejaamin.org",
    password: "admin123",
    role: adminRoles.bendahara,
  },
];

function normalizeSavedUser(user) {
  if (!user) return null;

  return {
    ...user,
    role: user.role === "admin" ? adminRoles.superAdmin : user.role,
    authMode: user.authMode || "demo",
  };
}

function getInitialUser() {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    const normalizedUser = normalizeSavedUser(parsed);

    if (normalizedUser.role !== parsed.role) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(normalizedUser));
    }

    return normalizedUser;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

function persistUser(user) {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(AUTH_KEY);
}

function getDemoUser({ email, password }) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const normalizedPassword = (password || "").trim();

  return demoUsers.find(
    (item) => item.email === normalizedEmail && item.password === normalizedPassword
  );
}

function createDemoSessionUser(matchedUser) {
  return {
    name: matchedUser.name,
    email: matchedUser.email,
    role: matchedUser.role,
    authMode: "demo",
  };
}

function getProfileRole(profile) {
  return profile?.role?.id || profile?.role_id;
}

function buildSupabaseUser(session, profile) {
  const role = getProfileRole(profile);

  if (!profile) {
    throw new Error("Profile admin belum dibuat. Tambahkan row di tabel profiles untuk user ini.");
  }

  if (!profile.is_active) {
    throw new Error("Profile admin tidak aktif. Hubungi Super Admin.");
  }

  if (!roleLabels[role]) {
    throw new Error("Role profile belum valid. Gunakan super_admin, bendahara, atau sekretaris.");
  }

  return {
    id: session.user.id,
    name: profile.full_name || session.user.email,
    email: session.user.email,
    role,
    authMode: "supabase",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (demoAuthEnabled ? getInitialUser() : null));
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState("");

  const applySupabaseSession = useCallback(async (session) => {
    if (!session?.user || !supabase) {
      if (!demoAuthEnabled) {
        persistUser(null);
        setUser(null);
      }
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) throw error;

    const nextUser = buildSupabaseUser(session, data);
    persistUser(nextUser);
    setUser(nextUser);
    setAuthError("");
    return nextUser;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    let mounted = true;

    Promise.resolve().then(async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) throw error;

        if (data.session) {
          await applySupabaseSession(data.session);
        } else if (!demoAuthEnabled) {
          persistUser(null);
          setUser(null);
        }
      } catch (sessionError) {
        if (!mounted) return;
        setAuthError(sessionError.message || "Gagal membaca session Supabase.");
        if (!demoAuthEnabled) {
          persistUser(null);
          setUser(null);
        }
      } finally {
        if (mounted) setAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(async () => {
        if (!mounted) return;

        try {
          if (session) {
            await applySupabaseSession(session);
          } else if (!demoAuthEnabled) {
            persistUser(null);
            setUser(null);
          }
        } catch (eventError) {
          if (!mounted) return;
          setAuthError(eventError.message || "Gagal sinkronisasi auth Supabase.");
          if (!demoAuthEnabled) {
            persistUser(null);
            setUser(null);
          }
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [applySupabaseSession]);

  const loginDemo = useCallback(({ email, password }) => {
    const matchedUser = getDemoUser({ email, password });
  
    if (matchedUser) {
      const loggedInUser = createDemoSessionUser(matchedUser);

      persistUser(loggedInUser);
      setUser(loggedInUser);
      setAuthError("");

      return {
        success: true,
        mode: "demo",
      };
    }

    return {
      success: false,
      message: "Email atau password salah.",
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setAuthError("");

    if (isSupabaseConfigured && supabase) {
      setAuthLoading(true);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: (email || "").trim().toLowerCase(),
          password,
        });

        if (error) throw error;

        const loggedInUser = await applySupabaseSession(data.session);

        return {
          success: true,
          mode: "supabase",
          user: loggedInUser,
        };
      } catch {
        if (demoAuthEnabled) {
          const fallbackResult = loginDemo({ email, password });

          if (fallbackResult.success) {
            return fallbackResult;
          }
        }

        const message = "Email atau password tidak sesuai.";
        setAuthError(message);
        return {
          success: false,
          message,
        };
      } finally {
        setAuthLoading(false);
      }
    }

    return loginDemo({ email, password });
  }, [applySupabaseSession, loginDemo]);

  const logout = useCallback(async () => {
    let logoutError = null;

    try {
      if (isSupabaseConfigured && supabase && user?.authMode === "supabase") {
        const { error } = await supabase.auth.signOut();
        if (error) logoutError = error;
      }
    } catch (error) {
      logoutError = error;
    } finally {
      persistUser(null);
      setUser(null);
    }

    if (logoutError) {
      setAuthError("Sesi telah ditutup, tetapi sinkronisasi akun belum selesai.");
      return {
        success: false,
        message: "Sesi telah ditutup. Silakan muat ulang halaman jika status akun belum berubah.",
      };
    }

    setAuthError("");
    return { success: true };
  }, [user]);

  const value = useMemo(
    () => ({
      authError,
      authLoading,
      authMode: user?.authMode || (isSupabaseConfigured ? "supabase" : "demo"),
      demoAuthEnabled,
      user,
      isAuthenticated: Boolean(user),
      isSupabaseAuth: user?.authMode === "supabase",
      login,
      logout,
    }),
    [authError, authLoading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
