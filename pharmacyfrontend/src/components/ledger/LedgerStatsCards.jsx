export default function LedgerStatsCards({ transactions = [] }) {
  const totalCount = transactions.length;

  const stockInItems = transactions.filter((t) => {
    const s = String(t.transactionType || "").toLowerCase().replace(/[\s_-]+/g, "");
    return t.transactionType === 1 || s === "1" || s === "stockin";
  });
  const stockInUnits = stockInItems.reduce((acc, curr) => acc + (Number(curr.Quantity) || Number(curr.quantity) || 0), 0);

  const stockOutItems = transactions.filter((t) => {
    const s = String(t.transactionType || "").toLowerCase().replace(/[\s_-]+/g, "");
    return t.transactionType === 2 || s === "2" || s === "stockout";
  });
  const stockOutUnits = stockOutItems.reduce((acc, curr) => acc + (Number(curr.Quantity) || Number(curr.quantity) || 0), 0);

  const adjustmentItems = transactions.filter((t) => {
    const s = String(t.transactionType || "").toLowerCase().replace(/[\s_-]+/g, "");
    return t.transactionType === 3 || s === "3" || s === "adjustment";
  });

  return (
    <div className="ledger-kpi-grid">
      {/* 1. Total Activity */}
      <div className="ledger-kpi-card">
        <div className="ledger-kpi-top">
          <span className="ledger-kpi-label">Total Movements</span>
          <div className="ledger-kpi-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        </div>
        <div className="ledger-kpi-value">{totalCount}</div>
        <p className="ledger-kpi-desc">Logged ledger transactions</p>
      </div>

      {/* 2. Stock Received */}
      <div className="ledger-kpi-card">
        <div className="ledger-kpi-top">
          <span className="ledger-kpi-label">Stock In (Received)</span>
          <div className="ledger-kpi-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
        <div className="ledger-kpi-value">+{stockInUnits}</div>
        <p className="ledger-kpi-desc">{stockInItems.length} intake transactions</p>
      </div>

      {/* 3. Stock Dispensed */}
      <div className="ledger-kpi-card">
        <div className="ledger-kpi-top">
          <span className="ledger-kpi-label">Stock Out (Dispensed)</span>
          <div className="ledger-kpi-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </div>
        </div>
        <div className="ledger-kpi-value">-{stockOutUnits}</div>
        <p className="ledger-kpi-desc">{stockOutItems.length} fulfillment operations</p>
      </div>

      {/* 4. Adjustments */}
      <div className="ledger-kpi-card">
        <div className="ledger-kpi-top">
          <span className="ledger-kpi-label">Adjustments</span>
          <div className="ledger-kpi-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
        </div>
        <div className="ledger-kpi-value">{adjustmentItems.length}</div>
        <p className="ledger-kpi-desc">Manual balance corrections</p>
      </div>
    </div>
  );
}
