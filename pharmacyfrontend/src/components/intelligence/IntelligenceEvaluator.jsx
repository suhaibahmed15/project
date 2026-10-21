import { getMedicineLabel, getBadgeClass, getBadgeLabel } from "./intelligenceUtils";

export default function IntelligenceEvaluator({
  medicines,
  batches,
  selectedMedicineId,
  setSelectedMedicineId,
  selectedBatchId,
  setSelectedBatchId,
  onEvaluate,
  evaluating,
  latestResult
}) {
  return (
    <div id="ai-evaluator-section" className="ai-evaluator-card">
      <div className="evaluator-header">
        <h2 className="evaluator-title">Run Predictive Stock-Out Evaluation</h2>
        <p className="evaluator-subtitle">
          Select a medicine to calculate run-out timelines, daily burn rates, and an AI risk score.
        </p>
      </div>

      <form onSubmit={onEvaluate} className="evaluator-form">
        <div className="form-group">
          <label className="form-label" htmlFor="med-select">Target Medicine *</label>
          <select
            id="med-select"
            className="form-select"
            value={selectedMedicineId}
            onChange={(e) => setSelectedMedicineId(e.target.value)}
            required
          >
            <option value="">-- Choose Medicine --</option>
            {medicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.medicineCode}) — Stock: {m.currentStock ?? 0}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="batch-select">Specific Batch (Optional)</label>
          <select
            id="batch-select"
            className="form-select"
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            disabled={!selectedMedicineId}
          >
            <option value="">Evaluate Entire Medicine Inventory</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                Batch #{b.batchNumber} (Rem: {b.remainingQuantity})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn-run-ai"
          disabled={evaluating || !selectedMedicineId}
          style={{ height: "38px" }}
        >
          {evaluating ? (
            <>
              <span className="btn-spinner" />
              Analyzing...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Generate Prediction
            </>
          )}
        </button>
      </form>

      {/* Live Result Display */}
      {latestResult && (
        <div className="prediction-result-display">
          <div className="prediction-result-header">
            <div>
              <h3 style={{ margin: "0 0 3px 0", fontSize: "15px", color: "#0f172a", fontWeight: "700" }}>
                {getMedicineLabel(medicines, latestResult.medicineId)}
              </h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Scope: {latestResult.batchId ? `Batch #${latestResult.batchId}` : "Total Stock Level"}
              </span>
            </div>

            <span className={`prediction-type-badge ${getBadgeClass(latestResult.predictionType, latestResult.predictionScore)}`}>
              {getBadgeLabel(latestResult.predictionType, latestResult.predictionScore)}
            </span>
          </div>

          <div className="prediction-stat-grid">
            <div className="stat-box">
              <span className="stat-label">Risk Probability</span>
              <span className="stat-value" style={{ color: latestResult.predictionScore >= 0.7 ? "#dc2626" : "#166534" }}>
                {(latestResult.predictionScore * 100).toFixed(0)}%
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-label">Estimated Days Left</span>
              <span className="stat-value">
                {latestResult.estimatedDaysRemaining > 0 ? `${latestResult.estimatedDaysRemaining} Days` : "Depleted"}
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-label">Daily Burn Rate</span>
              <span className="stat-value">
                {latestResult.averageDailyConsumption} units/day
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-label">Evaluation Date</span>
              <span className="stat-value" style={{ fontSize: "14px" }}>
                {new Date(latestResult.predictedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="explanation-callout">
            <strong>AI Recommendation & Insight:</strong> {latestResult.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
