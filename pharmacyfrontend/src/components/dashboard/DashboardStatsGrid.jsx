import "../../styles/dashboard.css";

export default function DashboardStatsGrid({ stats = {}, loading = false }) {
  const cards = [
    { label: "Total Medicines", value: stats.totalMedicines || 0, icon: "💊", colorClass: "kpi-navy" },
    { label: "Active Batches", value: stats.totalBatches || 0, icon: "📦", colorClass: "kpi-orange" },
    { label: "Low Stock", value: stats.lowStockCount || 0, icon: "⚠️", colorClass: "kpi-warning" },
    { label: "Near Expiry", value: stats.nearExpiryCount || 0, icon: "⏳", colorClass: "kpi-caution" },
    { label: "Expired", value: stats.expiredCount || 0, icon: "🚫", colorClass: "kpi-danger" },
    { label: "Unread Alerts", value: stats.unreadAlertsCount || 0, icon: "🔔", colorClass: "kpi-navy" }
  ];

  return (
    <div className="dashboard-stats-grid">
      {cards.map((card, index) => (
        <div key={index} className={`kpi-card ${card.colorClass}`}>
          <div className="kpi-header">
            <span className="kpi-label">{card.label}</span>
            <span>{card.icon}</span>
          </div>
          <div className="kpi-value">{loading ? "..." : card.value}</div>
        </div>
      ))}
    </div>
  );
}
