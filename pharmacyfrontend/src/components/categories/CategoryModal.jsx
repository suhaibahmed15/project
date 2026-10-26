import { useState, useEffect } from "react";
import "../../styles/categories.css";

export default function CategoryModal({
  isOpen,
  mode = "create", // "create" or "edit"
  initialData = null,
  onSubmit,
  onClose,
  loading = false,
  error = ""
}) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    isActive: true
  });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        id: initialData.id,
        name: initialData.name || "",
        description: initialData.description || "",
        isActive: initialData.isActive ?? true
      });
    } else {
      setFormData({
        id: 0,
        name: "",
        description: "",
        isActive: true
      });
    }
    setLocalError("");
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setLocalError("Category Name is required.");
      return;
    }
    if (formData.name.trim().length > 100) {
      setLocalError("Category Name cannot exceed 100 characters.");
      return;
    }
    if (formData.description && formData.description.length > 500) {
      setLocalError("Description cannot exceed 500 characters.");
      return;
    }
    setLocalError("");
    onSubmit(formData);
  };

  const displayError = localError || error;

  return (
    <div className="category-modal-backdrop" onClick={onClose}>
      <div className="category-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="category-modal-header">
          <h3 className="category-modal-title">
            {mode === "create" ? "Add New Category" : `Edit Category: ${initialData?.name || ""}`}
          </h3>
          <button
            type="button"
            className="category-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit}>
          <div className="category-modal-body">
            {displayError && (
              <div className="category-modal-error">{displayError}</div>
            )}

            {/* Category Name */}
            <div className="category-form-group">
              <label className="category-form-label" htmlFor="category-name-input">
                Category Name <span className="required">*</span>
              </label>
              <input
                id="category-name-input"
                type="text"
                className="category-form-input"
                placeholder="e.g., Antibiotics, Analgesics, Cardiovascular"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                maxLength={100}
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="category-form-group">
              <label className="category-form-label" htmlFor="category-desc-input">
                Description <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Optional)</span>
              </label>
              <textarea
                id="category-desc-input"
                className="category-form-textarea"
                placeholder="Brief description of this therapeutic class or pharmacological group..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={500}
                rows={3}
              />
            </div>

            {/* Status toggle on Edit */}
            {mode === "edit" && (
              <div className="category-form-group">
                <label className="category-form-label">Category Status</label>
                <label className="category-toggle-row">
                  <input
                    type="checkbox"
                    className="category-toggle-checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <span className="category-toggle-text">
                    {formData.isActive ? "Active (Available for medicine assignment)" : "Inactive (Archived)"}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="category-modal-footer">
            <button
              type="button"
              className="category-btn-subtle"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="category-add-btn"
              disabled={loading}
            >
              {loading
                ? mode === "create"
                  ? "Adding Category..."
                  : "Saving..."
                : mode === "create"
                ? "Create Category"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
