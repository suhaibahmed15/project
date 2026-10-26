import "../../styles/batches.css";

export default function BatchStatsCards({ batches = [], loading = false }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalBatches = batches.length;

  let expiredCount = 0;
  let nearExpiryCount = 0;
  let safeCount = 0;
  let totalRemainingUnits = 0;
  let totalInventoryValue = 0;

  batches.forEach((b) => {
    const exp = new Date(b.expiryDate);
    exp.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      expiredCount++;
    } else if (diffDays <= 30) {
      nearExpiryCount++;
    } else {
      safeCount++;
    }

    const rem = b.remainingQuantity || 0;
    totalRemainingUnits += rem;
    totalInventoryValue += rem * (b.unitCost || 0);
  });

  const cards = [
    {
      label: "Total Batches",
      value: totalBatches,
      hint: "All registered batches",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    },
    {
      label: "Near Expiry (≤30d)",
      value: nearExpiryCount,
      hint: "Requires prompt clearance",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      label: "Expired Batches",
      value: expiredCount,
      hint: "Remove from dispensing",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      )
    },
    {
      label: "Safe & Valid (>30d)",
      value: safeCount,
      hint: "Healthy shelf life",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    },
    {
      label: "Batch Stock Value",
      value: `PKR ${totalInventoryValue.toLocaleString()}`,
      hint: `${totalRemainingUnits.toLocaleString()} units remaining`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    }
  ];

  return (
    <div className="batch-stats-grid">
      {cards.map((card, idx) => (
        <div key={idx} className="batch-kpi-card">
          <div className="batch-kpi-header">
            <span className="batch-kpi-label">{card.label}</span>
            <span className="batch-kpi-icon">{card.icon}</span>
          </div>
          <div className="batch-kpi-value">{loading ? "..." : card.value}</div>
          <span className="batch-kpi-hint">{card.hint}</span>
        </div>
      ))}
    </div>
  );
}
