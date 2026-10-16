import "../../styles/dashboard.css";

export default function PharmacySummaryCard({ stats = {} }) {
  return (
    <div className="panel-card">
      <h3 className="panel-title">Pharmacy Summary</h3>
      <div className="panel-list" style={{ marginTop: "14px" }}>
        <div className="panel-item">
          <span className="panel-item-label">Categories</span>
          <span className="panel-item-val">{stats.totalCategories || 0}</span>
        </div>
        <div className="panel-item">
          <span className="panel-item-label">Suppliers</span>
          <span className="panel-item-val">{stats.totalSuppliers || 0}</span>
        </div>
        <div className="panel-item">
          <span className="panel-item-label">Total Purchases</span>
          <span className="panel-item-val text-emerald">
            PKR {(stats.totalPurchaseAmount || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
