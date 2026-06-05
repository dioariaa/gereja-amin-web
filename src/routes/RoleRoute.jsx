import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContextValue";

export default function RoleRoute({ allowedRoles, children }) {
  const { authLoading, user } = useAuth();

  if (authLoading) {
    return null;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
