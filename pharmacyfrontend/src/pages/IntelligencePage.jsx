import { useState, useEffect } from "react";
import { intelligenceApi, medicinesApi, batchesApi, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import IntelligenceStatsCards from "../components/intelligence/IntelligenceStatsCards";
import IntelligenceEvaluator from "../components/intelligence/IntelligenceEvaluator";
import IntelligenceTable from "../components/intelligence/IntelligenceTable";
import "../styles/intelligence.css";

export default function IntelligencePage() {
  const { roleName } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [latestResult, setLatestResult] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedMedicineId) {
      setBatches([]);
      setSelectedBatchId("");
      return;
    }

    batchesApi
      .getByMedicine(selectedMedicineId)
      .then((res) => setBatches(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBatches([]));
  }, [selectedMedicineId]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      const [predsRes, medsRes] = await Promise.all([
        intelligenceApi.getAll(),
        medicinesApi.getAll({ pageSize: 100 })
      ]);
      setPredictions(Array.isArray(predsRes.data) ? predsRes.data : []);
      const medData = medsRes.data?.items || medsRes.data || [];
      setMedicines(Array.isArray(medData) ? medData : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (e) => {
    e?.preventDefault();
    if (!selectedMedicineId) {
      setError("Please select a medicine to evaluate.");
      return;
    }

    setEvaluating(true);
    setError("");
    setSuccessMsg("");

    try {
      const payload = {
        medicineId: parseInt(selectedMedicineId, 10),
        batchId: selectedBatchId ? parseInt(selectedBatchId, 10) : null
      };

      const res = await intelligenceApi.evaluate(payload);
      setLatestResult(res.data);
      setSuccessMsg("AI evaluation completed successfully!");
      setPredictions((prev) => [res.data, ...prev.filter((p) => p.id !== res.data.id)]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setEvaluating(false);
    }
  };

  const handleReevaluate = (pred) => {
    setSelectedMedicineId(String(pred.medicineId));
    if (pred.batchId) setSelectedBatchId(String(pred.batchId));
    document.getElementById("ai-evaluator-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="intelligence-container">
      <div className="intelligence-header">
        <div>
          <h1 className="intelligence-title">AI Stock &amp; Expiry Intelligence</h1>
          <p className="intelligence-subtitle">
            Predictive stock-out forecasting, consumption burn rate modeling, and automated inventory depletion analytics.
          </p>
        </div>
        <div className="intelligence-header-actions">
          <span className="ai-pill-tag">AI Intelligence</span>
          <span className="role-access-pill">Role: {roleName} Authorized</span>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 0 }}>{error}</div>}
      {successMsg && <div className="form-success" style={{ marginBottom: 0 }}>{successMsg}</div>}

      <IntelligenceStatsCards predictions={predictions} />

      <IntelligenceEvaluator
        medicines={medicines}
        batches={batches}
        selectedMedicineId={selectedMedicineId}
        setSelectedMedicineId={setSelectedMedicineId}
        selectedBatchId={selectedBatchId}
        setSelectedBatchId={setSelectedBatchId}
        onEvaluate={handleEvaluate}
        evaluating={evaluating}
        latestResult={latestResult}
      />

      <IntelligenceTable
        predictions={predictions}
        medicines={medicines}
        loading={loading}
        onReevaluate={handleReevaluate}
      />
    </div>
  );
}
