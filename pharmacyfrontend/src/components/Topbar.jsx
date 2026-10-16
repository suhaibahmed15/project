import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/layout.css";

export default function Topbar({
  user,
  role,
  onLogout,
  onToggleSidebar,
  sidebarOpen
}) {
  const navigate = useNavigate(); // Initialize navigation
  const [alerts, setAlerts] = useState([
    // Keeping this state so your notification badge still works
  ]);

  const roleId =
    user?.roleId ??
    (typeof role === "number" ? role : role === "StoreManager" ? 2 : role === "Pharmacist" ? 3 : 1);
  const displayRole = `Role ID: ${roleId}`;

  const userName = user?.fullName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const userInitial = (userName.charAt(0) || "U").toUpperCase();

  const getRoleTheme = (id) => {
    if (id === 1) return "role-admin";
    if (id === 2) return "role-store-manager";
    return "role-pharmacist";
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>

        <div className="topbar-brand-title">
          <span className="system-pill">Pharmacy Stock and Expiry</span>
          <span className="system-env">Monitor</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Alert Button - Now Redirects */}
        <div className="topbar-alert-wrapper">
          <button
            type="button"
            className="topbar-alert-btn"
            onClick={() => navigate("/alerts")} // Triggers redirect
            title="Stock & Expiry Alerts"
            aria-label="Alerts"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {alerts.length > 0 && (
              <span className="topbar-alert-badge">{alerts.length}</span>
            )}
          </button>
        </div>

        {/* Role Display */}
        <div className={`topbar-role-badge ${getRoleTheme(roleId)}`}>
          <span className="role-text">{displayRole}</span>
        </div>

        {/* Who They Are (User identity) */}
        <div className="topbar-user-profile" title={`Signed in as ${userName} (${userEmail})`}>
          <div className="topbar-avatar">{userInitial}</div>
          <div className="topbar-user-text">
            <span className="topbar-user-name">{userName}</span>
            <span className="topbar-user-email">{userEmail || "Signed In"}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="topbar-logout-btn"
          title="Sign out of system"
        >
          Logout
        </button>
      </div>
    </header>
  );
}