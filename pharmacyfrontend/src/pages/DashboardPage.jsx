import { useState, useEffect } from "react";
import { dashboardApi } from "../api/client";
import StockBarChart from "../components/dashboard/StockBarChart";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid";
import PharmacySummaryCard from "../components/dashboard/PharmacySummaryCard";
import "../styles/dashboard.css";

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Load summary statistics from the backend
  const loadDashboard = () => {
    setLoading(true);
    dashboardApi
      .getSummary()
      .then((res) => setStats(res.data || {}))
      .catch((err) => console.error("Error loading dashboard:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="dashboard-page-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Pharmacy Dashboard</h1>
          <p className="dashboard-subtitle">Overview of medicines, inventory valuation, and stock ledger movements</p>
        </div>
        <button className="btn btn-primary dashboard-refresh-btn" onClick={loadDashboard}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* 6 KPI Stat Cards */}
      <DashboardStatsGrid stats={stats} loading={loading} />

      {/* Main Charts & Quick Summary Panel */}
      <div className="dashboard-visuals-row">
        {/* Stock Ledger Bar Chart */}
        <div className="dashboard-chart-column">
          <StockBarChart
            data={stats.stockLedgerData || []}
            loading={loading}
          />
        </div>

        {/* Quick Summary Panel */}
        <div className="dashboard-summary-panel">
          <PharmacySummaryCard stats={stats} />
        </div>
      </div>
    </div>
  );
}
