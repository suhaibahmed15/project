import { NavLink } from "react-router-dom";
import { ROLES } from "../utils/constants";
import "../styles/layout.css";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    )
  },
  {
    label: "Medicines",
    path: "/medicines",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-7L11 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
      </svg>
    )
  },
  {
    label: "Batches & Expiry",
    path: "/batches",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <circle cx="12" cy="15" r="2" />
      </svg>
    )
  },
  {
    label: "Stock Ledger",
    path: "/transactions",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )
  },
  {
    label: "Purchases",
    path: "/purchases",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    )
  },
  {
    label: "Alerts",
    path: "/alerts",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    label: "AI Intelligence",
    path: "/intelligence",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
      </svg>
    )
  },
  {
    label: "Categories",
    path: "/categories",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  },
  {
    label: "User Management",
    path: "/users",
    adminOnly: true,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
];

export default function Sidebar({
  userRole,
  isOpen = true,
  onToggle,
  onClose,
  user
}) {
  const isAdmin =
    userRole === 1 ||
    userRole === "1" ||
    (typeof userRole === "string" && userRole.toLowerCase() === ROLES.ADMIN.toLowerCase());

  const isStoreManager =
    userRole === 2 ||
    userRole === "2" ||
    (typeof userRole === "string" && userRole.toLowerCase() === "storemanager");

  const isManagerOrAdmin = isAdmin || isStoreManager;

  const displayName = user?.fullName || (user?.email ? user.email.split("@")[0] : "Sophia Reynolds");
  const displayRole =
    userRole === 1 || userRole === "Admin"
      ? "Administrator"
      : userRole === 2 || userRole === "StoreManager"
      ? "Store Manager"
      : "Pharmacist";

  const filteredItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.managerOrAdminOnly && !isManagerOrAdmin) return false;
    return true;
  });

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      {/* User Profile Row */}
      <div className="sidebar-user-row">
        
        {isOpen && (
          <div className="sidebar-user-info">
            <span className="sidebar-user-name" title={displayName}>
              {displayName}
            </span>
            <span className="sidebar-user-role">{displayRole}</span>
          </div>
        )}

        {/* Floating Toggle Pill (Chevron Arrow) */}
        {onToggle && (
          <button
            type="button"
            className={`sidebar-toggle-pill ${isOpen ? "" : "collapsed"}`}
            onClick={onToggle}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
            </svg>
          </button>
        )}
      </div>

      {/* 4. Section Divider */}
      <div className="sidebar-section-divider">
        <span className="sidebar-section-title">MENU</span>
      </div>

      {/* 5. Nav Items */}
      <nav className="sidebar-nav">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            data-tooltip={item.label}
            onClick={() => {
              if (window.innerWidth < 1024 && onClose) {
                onClose();
              }
            }}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>

            {isOpen && <span className="sidebar-link-text">{item.label}</span>}

            {item.badge && (
              <span className="sidebar-counter-pill">{item.badge}</span>
            )}

            {isOpen && item.adminOnly && !item.badge && (
              <span className="admin-chip">Admin</span>
            )}

            {isOpen && item.managerOrAdminOnly && !item.badge && !item.adminOnly && (
              <span className="ai-chip">AI</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
