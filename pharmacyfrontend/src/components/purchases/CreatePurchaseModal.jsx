import { useState, useEffect } from "react";
import "../../styles/purchases.css";
import "../../styles/medicines.css";

export default function CreatePurchaseModal({
  isOpen,
  suppliers = [],
  medicines = [],
  onSubmit,
  onClose,
  loading = false,
  error = ""
}) {
  const generatePONumber = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const rand = Math.floor(100 + Math.random() * 900);
    return `PO-${yyyy}${mm}${dd}-${rand}`;
  };

  const [formData, setFormData] = useState({
    purchaseNumber: "",
    supplierId: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
    notes: ""
  });

  const [items, setItems] = useState([
    { medicineId: "", quantity: 10, unitPrice: 0 }
  ]);

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        purchaseNumber: generatePONumber(),
        supplierId: suppliers[0]?.id || "",
        purchaseDate: new Date().toISOString().slice(0, 10),
        notes: ""
      });
      setItems([
        { medicineId: medicines[0]?.id || "", quantity: 10, unitPrice: 0 }
      ]);
      setLocalError("");
    }
  }, [isOpen, suppliers, medicines]);

  if (!isOpen) return null;

  // Handle line item changes
  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "medicineId" ? Number(value) || "" : value
      };
      return updated;
    });
  };

  // Add line item
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { medicineId: medicines[0]?.id || "", quantity: 10, unitPrice: 0 }
    ]);
  };

  // Remove line item
  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Compute Grand Total
  const grandTotal = items.reduce((sum, it) => {
    const q = Number(it.quantity) || 0;
    const p = Number(it.unitPrice) || 0;
    return sum + (q * p);
  }, 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 2
    }).format(val).replace("PKR", "Rs.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.purchaseNumber.trim()) {
      setLocalError("Purchase Number is required.");
      return;
    }

    if (!formData.supplierId) {
      setLocalError("Please select a supplier.");
      return;
    }

    if (!items || items.length === 0) {
      setLocalError("At least one medicine item is required.");
      return;
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.medicineId) {
        setLocalError(`Please select a medicine for item #${i + 1}.`);
        return;
      }
      if (Number(it.quantity) <= 0) {
        setLocalError(`Quantity must be greater than 0 for item #${i + 1}.`);
        return;
      }
      if (Number(it.unitPrice) < 0) {
        setLocalError(`Unit price cannot be negative for item #${i + 1}.`);
        return;
      }
    }

    const payload = {
      purchaseNumber: formData.purchaseNumber.trim(),
      supplierId: Number(formData.supplierId),
      purchaseDate: new Date(formData.purchaseDate).toISOString(),
      notes: formData.notes.trim() || null,
      purchaseItems: items.map((it) => ({
        medicineId: Number(it.medicineId),
        quantity: parseInt(it.quantity, 10),
        unitPrice: parseFloat(it.unitPrice) || 0
      }))
    };

    onSubmit(payload);
  };

  return (
    <div className="decent-modal-backdrop" onClick={onClose}>
      <div
        className="decent-modal"
        style={{ maxWidth: "780px", width: "95%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="decent-modal-header">
          <h3 className="decent-modal-title">Record New Purchase Order</h3>
          <button
            type="button"
            className="decent-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="decent-modal-body" style={{ maxHeight: "75vh", overflowY: "auto", padding: "18px 22px" }}>
            {(error || localError) && (
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  color: "#b91c1c",
                  fontSize: "13px",
                  marginBottom: "16px"
                }}
              >
                {localError || error}
              </div>
            )}

            {/* Top Order Information Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "16px" }}>
              <div className="decent-form-group">
                <label className="decent-label" htmlFor="purchaseNumber">
                  Purchase / PO # <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="purchaseNumber"
                  type="text"
                  className="decent-input"
                  value={formData.purchaseNumber}
                  onChange={(e) => setFormData({ ...formData, purchaseNumber: e.target.value })}
                  placeholder="e.g. PO-20261021-001"
                  required
                />
              </div>

              <div className="decent-form-group">
                <label className="decent-label" htmlFor="supplierId">
                  Supplier / Vendor <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <select
                  id="supplierId"
                  className="decent-select"
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.contactPerson ? `(${s.contactPerson})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="decent-form-group">
                <label className="decent-label" htmlFor="purchaseDate">
                  Purchase Date <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  id="purchaseDate"
                  type="date"
                  className="decent-input"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="decent-form-group" style={{ marginBottom: "18px" }}>
              <label className="decent-label" htmlFor="notes">
                Order Notes / Invoice Remarks (Optional)
              </label>
              <textarea
                id="notes"
                className="decent-input"
                style={{ height: "65px", resize: "vertical" }}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Payment due in 30 days, delivered via cold chain..."
              />
            </div>

            {/* Line Items Section */}
            <div className="line-items-section-title">
              <span>Order Line Items ({items.length})</span>
              <button
                type="button"
                className="btn-add-line"
                onClick={handleAddItem}
              >
                + Add Another Medicine
              </button>
            </div>

            {/* Line Items Table / Rows */}
            <div className="line-item-header">
              <div>Medicine</div>
              <div>Qty</div>
              <div>Unit Price (PKR)</div>
              <div>Subtotal (PKR)</div>
              <div></div>
            </div>

            {items.map((item, index) => {
              const qty = Number(item.quantity) || 0;
              const price = Number(item.unitPrice) || 0;
              const lineSubtotal = qty * price;

              return (
                <div key={index} className="line-item-row">
                  <div>
                    <select
                      className="decent-select"
                      style={{ width: "100%", fontSize: "12.5px" }}
                      value={item.medicineId}
                      onChange={(e) => handleItemChange(index, "medicineId", e.target.value)}
                      required
                    >
                      <option value="">Select Medicine</option>
                      {medicines.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.medicineCode ? `[${m.medicineCode}]` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="number"
                      min="1"
                      className="decent-input"
                      style={{ fontSize: "12.5px", padding: "6px 8px" }}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="decent-input"
                      style={{ fontSize: "12.5px", padding: "6px 8px" }}
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div style={{ fontWeight: 600, color: "#152614", fontSize: "13px" }}>
                    {formatCurrency(lineSubtotal)}
                  </div>

                  <div>
                    <button
                      type="button"
                      className="btn-remove-line"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length <= 1}
                      title="Remove line"
                      style={{ opacity: items.length <= 1 ? 0.4 : 1, cursor: items.length <= 1 ? "not-allowed" : "pointer" }}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Grand Total Summary */}
            <div className="purchase-form-grand-total">
              <span className="purchase-form-grand-total-label">Calculated Grand Total:</span>
              <span className="purchase-form-grand-total-val">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="decent-modal-footer">
            <button
              type="button"
              className="decent-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="decent-add-btn"
              disabled={loading}
            >
              {loading ? "Recording Purchase..." : "Save Purchase Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
