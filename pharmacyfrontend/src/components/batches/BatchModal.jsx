import { useState, useEffect } from "react";
import "../../styles/batches.css";

export default function BatchModal({
  isOpen = false,
  mode = "create", // "create" or "edit"
  initialData = null,
  medicines = [],
  onSubmit,
  onClose,
  loading = false,
  error = ""
}) {
  const [formData, setFormData] = useState({
    medicineId: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    initialQuantity: 100,
    unitCost: 0
  });

  const [localError, setLocalError] = useState("");

  const toInputDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        medicineId: initialData.medicineId || "",
        batchNumber: initialData.batchNumber || "",
        manufacturingDate: toInputDate(initialData.manufacturingDate),
        expiryDate: toInputDate(initialData.expiryDate),
        initialQuantity: initialData.initialQuantity ?? 0,
        unitCost: initialData.unitCost ?? 0
      });
    } else {
      const today = new Date();
      const oneYearLater = new Date();
      oneYearLater.setFullYear(today.getFullYear() + 1);

      setFormData({
        medicineId: medicines[0]?.id || "",
        batchNumber: `BAT-${today.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        manufacturingDate: today.toISOString().split("T")[0],
        expiryDate: oneYearLater.toISOString().split("T")[0],
        initialQuantity: 100,
        unitCost: 50
      });
    }
    setLocalError("");
  }, [initialData, mode, medicines, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "create" && !formData.medicineId) {
      setLocalError("Please select a medicine.");
      return;
    }

    if (!formData.batchNumber.trim()) {
      setLocalError("Please enter a valid batch number.");
      return;
    }

    if (!formData.manufacturingDate) {
      setLocalError("Please select a manufacturing date.");
      return;
    }

    if (!formData.expiryDate) {
      setLocalError("Please select an expiry date.");
      return;
    }

    const mfg = new Date(formData.manufacturingDate);
    const exp = new Date(formData.expiryDate);

    if (exp <= mfg) {
      setLocalError("Expiry date must be after manufacturing date.");
      return;
    }

    if (mode === "create" && Number(formData.initialQuantity) <= 0) {
      setLocalError("Initial quantity must be greater than 0.");
      return;
    }

    if (Number(formData.unitCost) < 0) {
      setLocalError("Unit cost cannot be negative.");
      return;
    }

    setLocalError("");

    if (mode === "create") {
      onSubmit({
        medicineId: Number(formData.medicineId),
        batchNumber: formData.batchNumber.trim(),
        manufacturingDate: new Date(formData.manufacturingDate).toISOString(),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        initialQuantity: Number(formData.initialQuantity),
        unitCost: Number(formData.unitCost)
      });
    } else {
      onSubmit({
        batchNumber: formData.batchNumber.trim(),
        manufacturingDate: new Date(formData.manufacturingDate).toISOString(),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        unitCost: Number(formData.unitCost)
      });
    }
  };

  return (
    <div className="batch-modal-backdrop" onClick={onClose}>
      <div className="batch-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="batch-modal-header">
          <h3 className="batch-modal-title">
            {mode === "create" ? "Add New Batch" : "Edit Batch Details"}
          </h3>
          <button
            type="button"
            className="batch-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="batch-modal-body">
            {(localError || error) && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  marginBottom: "16px"
                }}
              >
                ⚠️ {localError || error}
              </div>
            )}

            {/* Medicine Selector (Create only) */}
            <div className="batch-form-group">
              <label className="batch-label">Medicine *</label>
              {mode === "create" ? (
                <select
                  className="batch-select"
                  value={formData.medicineId}
                  onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
                  required
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.medicineCode}) — Stock: {m.currentStock ?? 0}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="batch-input"
                  value={initialData?.medicineName || `Medicine #${formData.medicineId}`}
                  disabled
                  style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                />
              )}
            </div>

            {/* Batch Number */}
            <div className="batch-form-group">
              <label className="batch-label">Batch Number *</label>
              <input
                type="text"
                className="batch-input"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="e.g. BAT-2026-001"
                required
              />
            </div>

            {/* Mfg and Expiry Dates */}
            <div className="batch-form-row">
              <div className="batch-form-group">
                <label className="batch-label">Manufacturing Date *</label>
                <input
                  type="date"
                  className="batch-input"
                  value={formData.manufacturingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturingDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="batch-form-group">
                <label className="batch-label">Expiry Date *</label>
                <input
                  type="date"
                  className="batch-input"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Quantity and Unit Cost */}
            <div className="batch-form-row">
              {mode === "create" && (
                <div className="batch-form-group">
                  <label className="batch-label">Initial Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    className="batch-input"
                    value={formData.initialQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, initialQuantity: e.target.value })
                    }
                    placeholder="e.g. 100"
                    required
                  />
                </div>
              )}

              <div className="batch-form-group" style={{ gridColumn: mode === "edit" ? "span 2" : "auto" }}>
                <label className="batch-label">Unit Cost (PKR) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="batch-input"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                  placeholder="e.g. 45.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="batch-modal-footer">
            <button
              type="button"
              className="batch-clear-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-add-batch"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Create Batch"
                : "Update Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
