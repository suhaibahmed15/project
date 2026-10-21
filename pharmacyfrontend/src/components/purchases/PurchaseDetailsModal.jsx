import "../../styles/purchases.css";

export default function PurchaseDetailsModal({ isOpen, purchase, onClose }) {
  if (!isOpen || !purchase) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 2
    }).format(Number(val) || 0).replace("PKR", "Rs.");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString("en-PK", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
  };

  const items = purchase.purchaseItems || [];
  const itemsCount = items.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);

  return (
    <div className="decent-modal-backdrop" onClick={onClose}>
      <div
        className="decent-modal"
        style={{ maxWidth: "720px", width: "95%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="decent-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="purchase-number-badge">{purchase.purchaseNumber}</span>
            <h3 className="decent-modal-title" style={{ margin: 0 }}>
              Purchase Invoice Details
            </h3>
          </div>
          <button
            type="button"
            className="decent-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="decent-modal-body" style={{ maxHeight: "75vh", overflowY: "auto", padding: "18px 20px" }}>
          {/* Hero Banner */}
          <div className="purchase-details-banner">
            <div>
              <div className="purchase-details-title">Purchase Order Overview</div>
              <div style={{ fontSize: "12.5px", color: "#d1fae5", marginTop: "4px" }}>
                Recorded on {formatDate(purchase.purchaseDate || purchase.createdAt)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="purchase-details-total-label">Invoice Total</div>
              <div className="purchase-details-total-val">
                {formatCurrency(purchase.totalAmount)}
              </div>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="purchase-meta-grid">
            <div className="purchase-meta-item">
              <div className="purchase-meta-item-label">Supplier / Vendor</div>
              <div className="purchase-meta-item-val" style={{ color: "#152614" }}>
                {purchase.supplierName || `Supplier #${purchase.supplierId}`}
              </div>
            </div>

            <div className="purchase-meta-item">
              <div className="purchase-meta-item-label">Purchase Date</div>
              <div className="purchase-meta-item-val">
                {formatDate(purchase.purchaseDate)}
              </div>
            </div>

            <div className="purchase-meta-item">
              <div className="purchase-meta-item-label">Total Units</div>
              <div className="purchase-meta-item-val">
                {itemsCount.toLocaleString()} units ({items.length} unique line {items.length === 1 ? "item" : "items"})
              </div>
            </div>

            <div className="purchase-meta-item">
              <div className="purchase-meta-item-label">Order Notes</div>
              <div className="purchase-meta-item-val" style={{ fontWeight: 400, color: purchase.notes ? "#334155" : "#94a3b8" }}>
                {purchase.notes || "None provided"}
              </div>
            </div>
          </div>

          {/* Line Items Breakdown Table */}
          <div style={{ marginTop: "16px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
              Purchased Line Items
            </h4>

            {items.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8", background: "#f8fafc", borderRadius: "8px" }}>
                No items recorded in this invoice.
              </div>
            ) : (
              <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                <table className="purchase-items-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ width: "40px", textAlign: "center" }}>#</th>
                      <th>Medicine</th>
                      <th style={{ textAlign: "right", width: "90px" }}>Qty</th>
                      <th style={{ textAlign: "right", width: "120px" }}>Unit Price</th>
                      <th style={{ textAlign: "right", width: "130px" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => {
                      const qty = Number(it.quantity) || 0;
                      const price = Number(it.unitPrice) || 0;
                      const lineTotal = qty * price;
                      return (
                        <tr key={it.id || `${it.medicineId}-${idx}`}>
                          <td style={{ textAlign: "center", color: "#94a3b8", fontWeight: 500 }}>
                            {idx + 1}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>
                              {it.medicineName || `Medicine #${it.medicineId}`}
                            </div>
                            {it.medicineCode && (
                              <div style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>
                                {it.medicineCode}
                              </div>
                            )}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 600, color: "#1e293b" }}>
                            {qty.toLocaleString()}
                          </td>
                          <td style={{ textAlign: "right", color: "#475569" }}>
                            {formatCurrency(price)}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "#152614" }}>
                            {formatCurrency(lineTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: "#f8fafc", borderTop: "2px solid #cbd5e1" }}>
                      <td colSpan={4} style={{ textAlign: "right", fontWeight: 700, color: "#1e293b", padding: "12px 14px" }}>
                        Grand Total:
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 800, color: "#152614", fontSize: "15px", padding: "12px 14px" }}>
                        {formatCurrency(purchase.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="decent-modal-footer">
          <button type="button" className="decent-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
