import { useState, useEffect } from "react";

export default function CreateAlertModal({
  isOpen,
  onClose,
  medicines = [],
  batches = [],
  onSubmit,
  loading = false
}) {
  const [medicineId, setMedicineId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [alertType, setAlertType] = useState("1"); // 1: LowStock, 2: NearExpiry, 3: Expired, 4: StockOut
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  // Filter batches for the selected medicine
  const availableBatches = batches.filter(
    (b) => String(b.medicineId) === String(medicineId)
  );

  // Auto-generate suggested message when medicine and type change
  useEffect(() => {
    if (!medicineId) return;
    const selectedMed = medicines.find((m) => String(m.id) === String(medicineId));
    const medName = selectedMed?.name || "Medicine";

    if (alertType === "1") {
      setMessage(`Stock level for ${medName} is below the required reorder threshold.`);
    } else if (alertType === "2") {
      setMessage(`Batch of ${medName} is approaching its expiration date within 30 days.`);
    } else if (alertType === "3") {
      setMessage(`Batch of ${medName} has expired and should be quarantined immediately.`);
    } else if (alertType === "4") {
      setMessage(`${medName} is completely out of stock.`);
    }
  }, [medicineId, alertType, medicines]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!medicineId) {
      setFormError("Please select a medicine.");
      return;
    }
    if (!message.trim()) {
      setFormError("Please enter an alert message.");
      return;
    }

    setFormError("");
    onSubmit({
      medicineId: Number(medicineId),
      batchId: batchId ? Number(batchId) : null,
      alertType: Number(alertType),
      message: message.trim()
    });
  };

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="alert-modal-header">
          <h3 className="alert-modal-title">Create Pharmacy Alert</h3>
          <button type="button" className="alert-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="alert-modal-body">
            {formError && (
              <div className="alerts-feedback-banner error">{formError}</div>
            )}

            {/* Select Medicine */}
            <div className="alert-form-group">
              <label className="alert-form-label">Medicine *</label>
              <select
                className="alert-form-select"
                value={medicineId}
                onChange={(e) => {
                  setMedicineId(e.target.value);
                  setBatchId("");
                }}
                required
              >
                <option value="">-- Choose Medicine --</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.brandName ? `(${m.brandName})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Batch (optional) */}
            <div className="alert-form-group">
              <label className="alert-form-label">Specific Batch (Optional)</label>
              <select
                className="alert-form-select"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                disabled={!medicineId || availableBatches.length === 0}
              >
                <option value="">
                  {!medicineId
                    ? "-- Select medicine first --"
                    : availableBatches.length === 0
                    ? "No batches found for this medicine"
                    : "-- All Batches / None --"}
                </option>
                {availableBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    Batch {b.batchNumber} (Stock: {b.remainingQuantity}, Exp:{" "}
                    {new Date(b.expiryDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Alert Type */}
            <div className="alert-form-group">
              <label className="alert-form-label">Alert Severity / Type *</label>
              <select
                className="alert-form-select"
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
              >
                <option value="1">⚠️ Low Stock (Below Reorder Level)</option>
                <option value="2">⏳ Near Expiry (Within 30 Days)</option>
                <option value="3">🚫 Expired (Past Expiry Date)</option>
                <option value="4">📦 Stock Out (Zero Inventory)</option>
              </select>
            </div>

            {/* Message */}
            <div className="alert-form-group">
              <label className="alert-form-label">Alert Description / Message *</label>
              <textarea
                className="alert-form-textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the alert reason or action needed..."
                required
              />
            </div>
          </div>

          <div className="alert-modal-footer">
            <button
              type="button"
              className="btn-outline-action"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create-alert"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Alert"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
