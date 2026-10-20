export default function AlertStatsCards({ alerts = [] }) {
  const totalAlerts = alerts.length;
  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const activeCount = alerts.filter((a) => !a.isResolved).length;
  const expiryCount = alerts.filter(
    (a) =>
      a.alertType === 2 ||
      a.alertType === 3 ||
      String(a.alertType).toLowerCase().includes("expiry") ||
      String(a.alertType).toLowerCase().includes("expired")
  ).length;
  const resolvedCount = alerts.filter((a) => a.isResolved).length;

  return (
    <div className="alerts-kpi-grid">
      {/* 1. Total Alerts */}
      <div className="alerts-kpi-card">
        <div className="alerts-kpi-top">
          <span className="alerts-kpi-label">Total Alerts</span>
          <div className="alerts-kpi-icon navy">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        </div>
        <div className="alerts-kpi-value">{totalAlerts}</div>
        <p className="alerts-kpi-desc">Generated system warnings</p>
      </div>

      {/* 2. Unread Alerts */}
      <div className="alerts-kpi-card">
        <div className="alerts-kpi-top">
          <span className="alerts-kpi-label">Unread</span>
          <div className="alerts-kpi-icon danger">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>
        <div className="alerts-kpi-value">{unreadCount}</div>
        <p className="alerts-kpi-desc">Requires immediate review</p>
      </div>

      {/* 3. Active / Pending Resolution */}
      <div className="alerts-kpi-card">
        <div className="alerts-kpi-top">
          <span className="alerts-kpi-label">Active (Unresolved)</span>
          <div className="alerts-kpi-icon warning">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
        <div className="alerts-kpi-value">{activeCount}</div>
        <p className="alerts-kpi-desc">Pending action by staff</p>
      </div>

      {/* 4. Expiry Issues */}
      <div className="alerts-kpi-card">
        <div className="alerts-kpi-top">
          <span className="alerts-kpi-label">Expiry / Expired</span>
          <div className="alerts-kpi-icon caution">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <div className="alerts-kpi-value">{expiryCount}</div>
        <p className="alerts-kpi-desc">Near expiry or expired batches</p>
      </div>

      {/* 5. Resolved */}
      <div className="alerts-kpi-card">
        <div className="alerts-kpi-top">
          <span className="alerts-kpi-label">Resolved</span>
          <div className="alerts-kpi-icon success">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <div className="alerts-kpi-value">{resolvedCount}</div>
        <p className="alerts-kpi-desc">Actioned and closed</p>
      </div>
    </div>
  );
}
