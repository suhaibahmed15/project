import { useState, useEffect } from "react";
import "../../styles/common.css";

export default function RecordTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  medicines = [],
  batches = [],
  loading = false,
  error = "",
  isAdmin = false
}) {
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [transactionType, setTransactionType] = useState("1"); // 1: StockIn, 2: StockOut, 3: Adjustment
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [isAdminOverride, setIsAdminOverride] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedMedicineId("");
      setSelectedBatchId("");
      setTransactionType("1");
      setQuantity("");
      setReason("");
      setIsAdminOverride(isAdmin);
      setFormError("");
    }
  }, [isOpen, isAdmin]);

  // Batches filtered by selected medicine
  const availableBatches = batches.filter(
    (b) => String(b.medicineId) === String(selectedMedicineId)
  );

  const selectedBatch = batches.find((b) => String(b.id) === String(selectedBatchId));

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedBatchId) {
      setFormError("Please select a target batch.");
      return;
    }

    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      setFormError("Quantity must be a positive number greater than 0.");
      return;
    }

    const typeNum = parseInt(transactionType, 10);
    if (typeNum === 3 && !isAdminOverride) {
      setFormError("Adjustments require an Admin Override.");
      return;
    }

    if (typeNum === 2 && selectedBatch && selectedBatch.remainingQuantity < qty) {
      setFormError(
        `Insufficient batch stock. Available: ${selectedBatch.remainingQuantity}, Requested: ${qty}`
      );
      return;
    }

    onSubmit({
      batchId: parseInt(selectedBatchId, 10),
      transactionType: typeNum,
      quantity: qty,
      reason: reason.trim() || undefined,
      isAdminOverride: Boolean(isAdminOverride)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="decent-modal-backdrop" onClick={onClose}>
      <div
        className="decent-modal"
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="decent-modal-header">
          <div>
            <h3 className="decent-modal-title">Record Stock Movement</h3>
            <p style={{ margin: "3px 0 0 0", fontSize: "12px", color: "#64748b" }}>
              Log an inventory intake, patient dispensing, or stock adjustment.
            </p>
          </div>
          <button
            type="button"
            className="decent-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="decent-modal-body">
            {(formError || error) && (
              <div className="decent-error-box" style={{ marginBottom: "14px" }}>
                {formError || error}
              </div>
            )}

            {/* Medicine Selector */}
            <div className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label" htmlFor="tx-med-select">
                Target Medicine *
              </label>
              <select
                id="tx-med-select"
                className="form-control"
                value={selectedMedicineId}
                onChange={(e) => {
                  setSelectedMedicineId(e.target.value);
                  setSelectedBatchId("");
                }}
                required
              >
                <option value="">-- Select Medicine --</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.medicineCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Selector */}
            <div className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label" htmlFor="tx-batch-select">
                Specific Batch *
              </label>
              <select
                id="tx-batch-select"
                className="form-control"
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                disabled={!selectedMedicineId}
                required
              >
                <option value="">
                  {!selectedMedicineId
                    ? "-- Choose medicine first --"
                    : availableBatches.length === 0
                    ? "-- No active batches found for this medicine --"
                    : "-- Select Batch --"}
                </option>
                {availableBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    Batch #{b.batchNumber} (Current Balance: {b.remainingQuantity} units)
                  </option>
                ))}
              </select>
              {selectedBatch && (
                <span style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>
                  Current Batch Balance: <strong>{selectedBatch.remainingQuantity}</strong> | Expiry:{" "}
                  {new Date(selectedBatch.expiryDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Transaction Type */}
            <div className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label" htmlFor="tx-type-select">
                Movement Type *
              </label>
              <select
                id="tx-type-select"
                className="form-control"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                required
              >
                <option value="1">Stock In (+ Receive Inventory)</option>
                <option value="2">Stock Out (- Dispense / Consume)</option>
                <option value="3">Adjustment (Set / Correct Balance)</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label" htmlFor="tx-qty-input">
                {transactionType === "3" ? "New Adjusted Total Quantity *" : "Quantity to Move *"}
              </label>
              <input
                id="tx-qty-input"
                type="number"
                min="1"
                step="1"
                className="form-control"
                placeholder="e.g. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            {/* Reason / Reference */}
            <div className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label" htmlFor="tx-reason-input">
                Reason / Reference (Optional)
              </label>
              <input
                id="tx-reason-input"
                type="text"
                maxLength={250}
                className="form-control"
                placeholder="e.g. Supplier PO-1092, Dispensed to patient, Physical count reconciliation"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* Admin Override */}
            {(transactionType === "3" || isAdmin) && (
              <div className="modal-admin-override-box">
                <input
                  id="tx-override-cb"
                  type="checkbox"
                  checked={isAdminOverride}
                  onChange={(e) => setIsAdminOverride(e.target.checked)}
                />
                <label htmlFor="tx-override-cb" style={{ cursor: "pointer", fontWeight: 600 }}>
                  Authorize with Administrator Override (audit logged)
                </label>
              </div>
            )}
          </div>

          <div className="decent-modal-footer">
            <button type="button" className="decent-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ backgroundColor: "#152614", borderColor: "#152614" }}
            >
              {loading ? "Recording..." : "Confirm & Save Movement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
