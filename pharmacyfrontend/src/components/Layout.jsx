import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = (pathname) => {
    if (pathname === "/") return "Dashboard Overview";
    if (pathname.startsWith("/medicines")) return "Medicine Inventory";
    if (pathname.startsWith("/batches")) return "Batches & Expiry Dates";
    if (pathname.startsWith("/transactions")) return "Stock Ledger";
    if (pathname.startsWith("/purchases")) return "Purchase Orders";
    if (pathname.startsWith("/alerts")) return "Stock & Expiry Alerts";
    if (pathname.startsWith("/intelligence")) return "AI Stock Intelligence";
    if (pathname.startsWith("/categories")) return "Medicine Categories";
    if (pathname.startsWith("/suppliers")) return "Suppliers Directory";
    if (pathname.startsWith("/users")) return "User Management";
    return "Pharmacy Management";
  };

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={role}
      />

      <div className="main-area">
        <Topbar
          activeTitle={getPageTitle(location.pathname)}
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="page-content">
          <Outlet />
        </main>

        <footer className="page-footer">
          &copy; {new Date().getFullYear()} Pharmacy Stock &amp; Expiry Monitor.
        </footer>
      </div>
    </div>
  );
}
