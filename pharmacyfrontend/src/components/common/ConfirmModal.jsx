import "../../styles/medicines.css";

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  note,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
  loading = false,
  danger = true
}) {
  if (!isOpen) return null;

  return (
    <div className="decent-modal-backdrop" onClick={onClose}>
      <div
        className="decent-modal"
        style={{ maxWidth: "420px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="decent-modal-header">
          <h3
            className="decent-modal-title"
            style={{ color: danger ? "#dc2626" : "#0f172a" }}
          >
            {title}
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

        <div className="decent-modal-body">
          <p style={{ margin: "0 0 8px 0", fontSize: "13.5px", color: "#334155" }}>
            {message}
          </p>
          {note && (
            <p style={{ margin: 0, fontSize: "12.5px", color: "#64748b" }}>
              {note}
            </p>
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
            type="button"
            className={danger ? "decent-action-btn delete" : "decent-add-btn"}
            style={{ padding: "6px 14px", fontSize: "12.5px" }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
