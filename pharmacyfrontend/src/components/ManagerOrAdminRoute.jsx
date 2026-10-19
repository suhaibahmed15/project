import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UnauthorizedPage from "../pages/UnauthorizedPage";

export default function ManagerOrAdminRoute() {
  const { isAuthenticated, isAdmin, isStoreManager, roleId } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = Boolean(
    isAdmin ||
    isStoreManager ||
    roleId === 1 ||
    roleId === 2 ||
    roleId === "1" ||
    roleId === "2"
  );

  if (!hasAccess) {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
}
