export default function PurchaseStatsCards({ purchases = [] }) {
  // Aggregate KPIs
  const totalCount = purchases.length;
  const totalSpend = purchases.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);
  const avgOrderValue = totalCount > 0 ? totalSpend / totalCount : 0;

  // Distinct suppliers count
  const uniqueSuppliers = new Set(
    purchases.map((p) => p.supplierId || p.supplierName).filter(Boolean)
  ).size;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0
    }).format(val).replace("PKR", "Rs.");
  };

  return (
    <div className="purchases-kpi-grid">
      {/* Total Purchases Card */}
      <div className="purchases-kpi-card">
        <div className="purchases-kpi-top">
          <span className="purchases-kpi-label">Total Invoices</span>
          <div className="purchases-kpi-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>
        <div className="purchases-kpi-value">{totalCount.toLocaleString()}</div>
        <p className="purchases-kpi-subtext">Recorded supplier orders</p>
      </div>

      {/* Total Spend Card */}
      <div className="purchases-kpi-card">
        <div className="purchases-kpi-top">
          <span className="purchases-kpi-label">Total Procurement Spend</span>
          <div className="purchases-kpi-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
        <div className="purchases-kpi-value">{formatCurrency(totalSpend)}</div>
        <p className="purchases-kpi-subtext">Cumulative invoice amount</p>
      </div>

      {/* Average Order Value */}
      <div className="purchases-kpi-card">
        <div className="purchases-kpi-top">
          <span className="purchases-kpi-label">Avg Order Value</span>
          <div className="purchases-kpi-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
        </div>
        <div className="purchases-kpi-value">{formatCurrency(avgOrderValue)}</div>
        <p className="purchases-kpi-subtext">Per purchase order average</p>
      </div>

      {/* Active Suppliers */}
      <div className="purchases-kpi-card">
        <div className="purchases-kpi-top">
          <span className="purchases-kpi-label">Active Vendors</span>
          <div className="purchases-kpi-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
        </div>
        <div className="purchases-kpi-value">{uniqueSuppliers}</div>
        <p className="purchases-kpi-subtext">Suppliers with orders</p>
      </div>
    </div>
  );
}
