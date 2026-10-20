import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { alertsApi } from "../api/client";
import "../styles/layout.css";

export default function Topbar({
  user,
  role,
  onLogout,
  onToggleSidebar,
  sidebarOpen
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch real unread alert count from backend
  const fetchUnreadAlerts = useCallback(async () => {
    try {
      const res = await alertsApi.getAll();
      const list = Array.isArray(res.data) ? res.data : [];
      const unread = list.filter((a) => !a.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch unread alerts count for topbar:", err);
    }
  }, []);

  useEffect(() => {
    fetchUnreadAlerts();

    // Listen for custom event when alerts are updated in AlertsPage
    const handleAlertsUpdated = () => fetchUnreadAlerts();
    window.addEventListener("alerts-updated", handleAlertsUpdated);

    // Refresh every 30 seconds for background notifications
    const interval = setInterval(fetchUnreadAlerts, 30000);

    return () => {
      window.removeEventListener("alerts-updated", handleAlertsUpdated);
      clearInterval(interval);
    };
  }, [fetchUnreadAlerts]);

  // Re-fetch when navigating between pages
  useEffect(() => {
    fetchUnreadAlerts();
  }, [location.pathname, fetchUnreadAlerts]);

  const userName = user?.fullName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const userInitial = (userName.charAt(0) || "U").toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-arrow-btn"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Collapse navigation menu" : "Expand navigation menu"}
          title={sidebarOpen ? "Collapse navigation menu" : "Expand navigation menu"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {sidebarOpen ? (
              <polyline points="15 18 9 12 15 6" />
            ) : (
              <polyline points="9 18 15 12 9 6" />
            )}
          </svg>
        </button>

        <div className="topbar-brand-title">
          <span className="system-pill">Pharmacy Stock and Expiry</span>
          <span className="system-env">Monitor</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Real Unread Alerts Bell Button */}
        <div className="topbar-alert-wrapper">
          <button
            type="button"
            className="topbar-alert-btn"
            onClick={() => navigate("/alerts")}
            title={
              unreadCount > 0
                ? `${unreadCount} unread alert${unreadCount === 1 ? "" : "s"}`
                : "Stock & Expiry Alerts"
            }
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
            {unreadCount > 0 && (
              <span className="topbar-alert-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile */}
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
          aria-label="Log out"
          title="Sign out of your account"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="topbar-logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
}