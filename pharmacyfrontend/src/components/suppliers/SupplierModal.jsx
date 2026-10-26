import { useState, useEffect } from "react";
import "../../styles/suppliers.css";

export default function SupplierModal({
  isOpen,
  mode = "create",
  initialData,
  onSubmit,
  onClose,
  loading = false,
  error = ""
}) {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    isActive: true
  });

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        name: initialData.name || "",
        contactPerson: initialData.contactPerson || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        isActive: initialData.isActive ?? true
      });
    } else {
      setFormData({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        isActive: true
      });
    }
    setLocalError("");
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setLocalError("Supplier / Company name is required.");
      return;
    }
    setLocalError("");
    onSubmit(formData);
  };

  const displayError = localError || error;

  return (
    <div className="supplier-modal-backdrop" onClick={onClose}>
      <div className="supplier-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="supplier-modal-header">
          <h3 className="supplier-modal-title">
            {mode === "create" ? "Add New Supplier" : `Edit Supplier: ${initialData?.name}`}
          </h3>
          <button
            type="button"
            className="supplier-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="supplier-modal-body">
            {displayError && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                  padding: "9px 13px",
                  borderRadius: "6px",
                  fontSize: "12.5px"
                }}
              >
                {displayError}
              </div>
            )}

            {/* Supplier Name */}
            <div className="supplier-form-group">
              <label className="supplier-form-label" htmlFor="supplier-name">
                Supplier / Company Name <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id="supplier-name"
                type="text"
                className="supplier-form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Abbott Laboratories Pakistan"
                required
              />
            </div>

            {/* Contact Person & Phone */}
            <div className="supplier-form-row">
              <div className="supplier-form-group">
                <label className="supplier-form-label" htmlFor="supplier-contact">
                  Contact Person
                </label>
                <input
                  id="supplier-contact"
                  type="text"
                  className="supplier-form-input"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Tariq Mehmood"
                />
              </div>

              <div className="supplier-form-group">
                <label className="supplier-form-label" htmlFor="supplier-phone">
                  Phone Number
                </label>
                <input
                  id="supplier-phone"
                  type="text"
                  className="supplier-form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +92 21 3506 9741"
                />
              </div>
            </div>

            {/* Email */}
            <div className="supplier-form-group">
              <label className="supplier-form-label" htmlFor="supplier-email">
                Email Address
              </label>
              <input
                id="supplier-email"
                type="email"
                className="supplier-form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. orders@abbott.pk"
              />
            </div>

            {/* Address */}
            <div className="supplier-form-group">
              <label className="supplier-form-label" htmlFor="supplier-address">
                Physical / Office Address
              </label>
              <textarea
                id="supplier-address"
                className="supplier-form-input"
                style={{ height: "65px", resize: "vertical" }}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Plot 13-14, Sector 20, Korangi Industrial Area, Karachi"
              />
            </div>

            {/* Status toggle in Edit mode */}
            {mode === "edit" && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  id="supplier-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: "16px", height: "16px", accentColor: "#152614", cursor: "pointer" }}
                />
                <label htmlFor="supplier-active" style={{ fontSize: "13px", fontWeight: "600", color: "#334155", cursor: "pointer" }}>
                  Active Supplier (Available for placing purchase orders)
                </label>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="supplier-modal-footer">
            <button
              type="button"
              className="supplier-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="supplier-btn-submit"
              disabled={loading}
            >
              {loading ? "Saving..." : mode === "create" ? "Add Supplier" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
