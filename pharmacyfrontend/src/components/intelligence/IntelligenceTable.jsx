import { useState, useMemo } from "react";
import Pagination from "../common/Pagination";
import {
  getMedicineLabel,
  getBadgeClass,
  getBadgeLabel,
  getScoreFillClass,
  getRiskLevel
} from "./intelligenceUtils";

export default function IntelligenceTable({
  predictions = [],
  medicines = [],
  loading = false,
  onReevaluate
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((item) => {
      if (riskFilter !== "all") {
        const itemLevel = getRiskLevel(item.predictionScore, item.predictionType);
        if (itemLevel !== riskFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const medName = getMedicineLabel(medicines, item.medicineId).toLowerCase();
        const explanation = (item.explanation || "").toLowerCase();
        const type = (item.predictionType || "").toLowerCase();
        const label = getBadgeLabel(item.predictionType, item.predictionScore).toLowerCase();
        return medName.includes(q) || explanation.includes(q) || type.includes(q) || label.includes(q);
      }

      return true;
    });
  }, [predictions, riskFilter, searchQuery, medicines]);

  const totalCount = filteredPredictions.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedPredictions = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return filteredPredictions.slice(startIndex, startIndex + pageSize);
  }, [filteredPredictions, safePage, pageSize]);

  const handleFilterClick = (filter) => {
    setRiskFilter(filter);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="intelligence-history-card">
      <div className="history-toolbar">
        <div className="filter-chips-row">
          <button
            type="button"
            className={`filter-chip-btn ${riskFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            All ({predictions.length})
          </button>
          <button
            type="button"
            className={`filter-chip-btn ${riskFilter === "high" ? "active" : ""}`}
            onClick={() => handleFilterClick("high")}
          >
            High Risk ({predictions.filter((p) => getRiskLevel(p.predictionScore, p.predictionType) === "high").length})
          </button>
          <button
            type="button"
            className={`filter-chip-btn ${riskFilter === "medium" ? "active" : ""}`}
            onClick={() => handleFilterClick("medium")}
          >
            Medium Risk ({predictions.filter((p) => getRiskLevel(p.predictionScore, p.predictionType) === "medium").length})
          </button>
          <button
            type="button"
            className={`filter-chip-btn ${riskFilter === "low" ? "active" : ""}`}
            onClick={() => handleFilterClick("low")}
          >
            Low Risk ({predictions.filter((p) => getRiskLevel(p.predictionScore, p.predictionType) === "low").length})
          </button>
        </div>

        <input
          type="text"
          className="history-search-input"
          placeholder="Search by medicine or insight..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div className="intelligence-empty-state">
          <p>Loading AI Intelligence models...</p>
        </div>
      ) : filteredPredictions.length === 0 ? (
        <div className="intelligence-empty-state">
          <p>
            {searchQuery || riskFilter !== "all"
              ? "No evaluation results match your search filters."
              : "No intelligence evaluations have been generated yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="intelligence-table-wrapper">
            <table className="intelligence-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Scope</th>
                  <th>Burn Rate</th>
                  <th>Days Left</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>AI Insight</th>
                  <th>Evaluated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPredictions.map((pred) => (
                  <tr key={pred.id}>
                    <td>
                      <strong style={{ color: "#0f172a" }}>
                        {getMedicineLabel(medicines, pred.medicineId)}
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ fontSize: "11px" }}>
                        {pred.batchId ? `Batch #${pred.batchId}` : "Entire Stock"}
                      </span>
                    </td>
                    <td>
                      <strong>{pred.averageDailyConsumption}</strong>{" "}
                      <span style={{ fontSize: "11px", color: "#64748b" }}>u/d</span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: "700",
                          color:
                            pred.estimatedDaysRemaining <= 3
                              ? "#dc2626"
                              : pred.estimatedDaysRemaining <= 7
                              ? "#d97706"
                              : "#16a34a"
                        }}
                      >
                        {pred.estimatedDaysRemaining > 0 ? `${pred.estimatedDaysRemaining}d` : "Depleted"}
                      </span>
                    </td>
                    <td>
                      <div className="score-meter">
                        <div className="score-bar-bg">
                          <div
                            className={`score-bar-fill ${getScoreFillClass(pred.predictionScore)}`}
                            style={{ width: `${Math.min(pred.predictionScore * 100, 100)}%` }}
                          />
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "700" }}>
                          {(pred.predictionScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`prediction-type-badge ${getBadgeClass(pred.predictionType, pred.predictionScore)}`}>
                        {getBadgeLabel(pred.predictionType, pred.predictionScore)}
                      </span>
                    </td>
                    <td style={{ maxWidth: "250px" }}>
                      <span style={{ fontSize: "12px", color: "#475569", lineHeight: "1.4" }}>
                        {pred.explanation}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "#64748b", fontSize: "12px" }}>
                      {new Date(pred.predictedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-reevaluate"
                        title="Re-run analysis for this medicine"
                        onClick={() => onReevaluate?.(pred)}
                      >
                        Re-evaluate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={safePage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}
