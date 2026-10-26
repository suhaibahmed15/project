import "../../styles/suppliers.css";

export default function SupplierStatsGrid({
  totalCount = 0,
  activeCount = 0,
  inactiveCount = 0,
  totalOrdersCount = 0
}) {
  return (
    <div className="supplier-stats-grid">
      {/* Total Suppliers */}
      <div className="supplier-stat-card">
        <div className="supplier-stat-info">
          <span className="supplier-stat-label">Total Suppliers</span>
          <span className="supplier-stat-value">{totalCount}</span>
          <span className="supplier-stat-sub">Distributors registered</span>
        </div>
        <div className="supplier-stat-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="1" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
      </div>

      {/* Active Suppliers */}
      <div className="supplier-stat-card">
        <div className="supplier-stat-info">
          <span className="supplier-stat-label">Active</span>
          <span className="supplier-stat-value">{activeCount}</span>
          <span className="supplier-stat-sub">Authorized for orders</span>
        </div>
        <div className="supplier-stat-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
      </div>

      {/* Inactive Suppliers */}
      <div className="supplier-stat-card">
        <div className="supplier-stat-info">
          <span className="supplier-stat-label">Inactive</span>
          <span className="supplier-stat-value">{inactiveCount}</span>
          <span className="supplier-stat-sub">Suspended or archived</span>
        </div>
        <div className="supplier-stat-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
      </div>

      {/* Purchase Orders Linked */}
      <div className="supplier-stat-card">
        <div className="supplier-stat-info">
          <span className="supplier-stat-label">Purchase Orders</span>
          <span className="supplier-stat-value">{totalOrdersCount}</span>
          <span className="supplier-stat-sub">Invoices on record</span>
        </div>
        <div className="supplier-stat-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
      </div>
    </div>
  );
}
