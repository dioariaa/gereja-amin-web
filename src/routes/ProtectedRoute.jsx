import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContextValue";

export default function ProtectedRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="brand-card max-w-sm p-6">
          <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
            Admin Gereja
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Memeriksa session admin...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
