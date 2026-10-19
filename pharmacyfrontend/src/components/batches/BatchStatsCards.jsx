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
      icon: "📦",
      colorClass: "kpi-navy"
    },
    {
      label: "Near Expiry (≤30d)",
      value: nearExpiryCount,
      hint: "Requires prompt clearance",
      icon: "⏳",
      colorClass: "kpi-orange"
    },
    {
      label: "Expired Batches",
      value: expiredCount,
      hint: "Remove from dispensing",
      icon: "🚫",
      colorClass: "kpi-danger"
    },
    {
      label: "Safe & Valid (>30d)",
      value: safeCount,
      hint: "Healthy shelf life",
      icon: "✅",
      colorClass: "kpi-success"
    },
    {
      label: "Batch Stock Value",
      value: `PKR ${totalInventoryValue.toLocaleString()}`,
      hint: `${totalRemainingUnits.toLocaleString()} units remaining`,
      icon: "💰",
      colorClass: "kpi-purple"
    }
  ];

  return (
    <div className="batch-stats-grid">
      {cards.map((card, idx) => (
        <div key={idx} className={`batch-kpi-card ${card.colorClass}`}>
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
