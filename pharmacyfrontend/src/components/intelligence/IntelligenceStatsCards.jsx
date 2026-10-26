import { getRiskLevel } from "./intelligenceUtils";

export default function IntelligenceStatsCards({ predictions = [] }) {
  const totalEvaluations = predictions.length;
  
  const highRiskCount = predictions.filter(
    (p) => getRiskLevel(p.predictionScore, p.predictionType) === "high"
  ).length;

  const validConsumptions = predictions.filter((p) => p.averageDailyConsumption > 0);
  const avgDailyConsumption =
    validConsumptions.length > 0
      ? (
          validConsumptions.reduce((acc, curr) => acc + Number(curr.averageDailyConsumption), 0) /
          validConsumptions.length
        ).toFixed(1)
      : "0";

  const criticalStockCount = predictions.filter(
    (p) => p.estimatedDaysRemaining > 0 && p.estimatedDaysRemaining <= 3
  ).length;

  return (
    <div className="intelligence-kpi-grid">
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Total AI Predictions</span>
          <div className="kpi-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
            </svg>
          </div>
        </div>
        <div className="kpi-value">{totalEvaluations}</div>
        <p className="kpi-subtext">Active algorithmic evaluations</p>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Stock-Out Threats</span>
          <div className="kpi-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>
        <div className="kpi-value">{highRiskCount}</div>
        <p className="kpi-subtext">Items with critical or high risk</p>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Urgent (&le; 3 Days Left)</span>
          <div className="kpi-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <div className="kpi-value">{criticalStockCount}</div>
        <p className="kpi-subtext">Immediate replenishment required</p>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Avg Burn Rate</span>
          <div className="kpi-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </div>
        <div className="kpi-value">
          {avgDailyConsumption}{" "}
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>u/day</span>
        </div>
        <p className="kpi-subtext">Mean daily consumption pace</p>
      </div>
    </div>
  );
}
