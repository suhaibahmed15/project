import { useState, useEffect } from "react";
import "../../styles/medicines.css";

export default function MedicineModal({
  isOpen,
  mode = "create", // "create" or "edit"
  initialData,
  categories = [],
  onSubmit,
  onClose,
  loading = false,
  error = ""
}) {
  const [formData, setFormData] = useState({
    id: 0,
    medicineCode: "",
    name: "",
    genericName: "",
    description: "",
    categoryId: "",
    reorderLevel: 20,
    isActive: true
  });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        id: initialData.id,
        medicineCode: initialData.medicineCode || "",
        name: initialData.name || "",
        genericName: initialData.genericName || "",
        description: initialData.description || "",
        categoryId: initialData.categoryId || categories[0]?.id || "",
        reorderLevel: initialData.reorderLevel ?? 20,
        isActive: initialData.isActive ?? true
      });
    } else {
      setFormData({
        id: 0,
        medicineCode: `MED-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        genericName: "",
        description: "",
        categoryId: categories[0]?.id || "",
        reorderLevel: 20,
        isActive: true
      });
    }
    setLocalError("");
  }, [initialData, mode, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.medicineCode.trim() || !formData.name.trim() || !formData.categoryId) {
      setLocalError("Please fill in Code, Medicine Name, and select a Category.");
      return;
    }
    setLocalError("");
    onSubmit(formData);
  };

  const displayError = localError || error;

  return (
    <div className="decent-modal-backdrop" onClick={onClose}>
      <div className="decent-modal" onClick={(e) => e.stopPropagation()}>
        <div className="decent-modal-header">
          <h3 className="decent-modal-title">
            {mode === "create" ? "Add Medicine" : "Edit Medicine"}
          </h3>
          <button
            type="button"
            className="decent-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="decent-modal-body">
            {displayError && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "12.5px",
                  marginBottom: "12px"
                }}
              >
                {displayError}
              </div>
            )}

            <div className="decent-form-row">
              <div className="decent-form-group">
                <label className="decent-label">Code *</label>
                <input
                  type="text"
                  className="decent-input"
                  value={formData.medicineCode}
                  onChange={(e) =>
                    setFormData({ ...formData, medicineCode: e.target.value })
                  }
                  placeholder="e.g. MED-020"
                  required
                />
              </div>

              <div className="decent-form-group">
                <label className="decent-label">Category *</label>
                <select
                  className="decent-input"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="decent-form-group">
              <label className="decent-label">Medicine Name *</label>
              <input
                type="text"
                className="decent-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Paracetamol 500mg"
                required
              />
            </div>

            <div className="decent-form-row">
              <div className="decent-form-group">
                <label className="decent-label">Generic Name</label>
                <input
                  type="text"
                  className="decent-input"
                  value={formData.genericName}
                  onChange={(e) =>
                    setFormData({ ...formData, genericName: e.target.value })
                  }
                  placeholder="e.g. Paracetamol"
                />
              </div>

              <div className="decent-form-group">
                <label className="decent-label">Reorder Level *</label>
                <input
                  type="number"
                  min="0"
                  className="decent-input"
                  value={formData.reorderLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, reorderLevel: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="decent-form-group">
              <label className="decent-label">Description</label>
              <textarea
                rows="2"
                className="decent-textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief notes or indications..."
              />
            </div>

            {mode === "edit" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px"
                }}
              >
                <input
                  type="checkbox"
                  id="modalActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  style={{ width: "15px", height: "15px", cursor: "pointer" }}
                />
                <label
                  htmlFor="modalActiveToggle"
                  style={{
                    fontSize: "13px",
                    cursor: "pointer",
                    color: "#334155"
                  }}
                >
                  Active medicine in inventory
                </label>
              </div>
            )}
          </div>

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
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Save Medicine"
                : "Update Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
