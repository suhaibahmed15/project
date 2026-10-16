import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UnauthorizedPage from "../pages/UnauthorizedPage";

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, roleId } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isUserAdmin = Boolean(isAdmin || roleId === 1 || roleId === "1");

  if (!isUserAdmin) {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
}
