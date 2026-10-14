
export default function Topbar({
  activeTitle = "Overview",
  user,
  onLogout,
  onToggleSidebar,
  sidebarOpen
}) {
  const roleDisplay =
    user?.role === "StoreManager"
      ? "Store Manager"
      : user?.role || "Pharmacist";

  const userInitial = ((user?.fullName || user?.email || "U").charAt(0)).toUpperCase();
  const userName = user?.fullName || user?.email || "User";

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

        <div className="topbar-title">
          <span className="title-section">Pharmacy Stock</span>
          <span className="title-chevron">&gt;</span>
          <span className="title-current">{activeTitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-user-info">
          <span className="user-avatar">{userInitial}</span>
          <div className="user-details">
            <span className="user-name">{userName}</span>
            <span className="user-role-label">{roleDisplay}</span>
          </div>
        </div>

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
