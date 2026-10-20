import SortableTh from "../common/SortableTh";
import Pagination from "../common/Pagination";
import "../../styles/batches.css";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
}

function getExpiryInfo(expiryDate) {
  if (!expiryDate) return { pillClass: "safe", icon: "—", text: "—" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);

  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      pillClass: "expired",
      icon: "🚫",
      text: `Expired (${Math.abs(diffDays)}d ago)`
    };
  }
  if (diffDays === 0) {
    return {
      pillClass: "expired",
      icon: "⚠️",
      text: "Expires Today"
    };
  }
  if (diffDays <= 30) {
    return {
      pillClass: "near",
      icon: "⏳",
      text: `Expires in ${diffDays}d`
    };
  }
  if (diffDays <= 90) {
    const mos = Math.max(1, Math.round(diffDays / 30));
    return {
      pillClass: "warning",
      icon: "⚠️",
      text: `${mos} mos left (${diffDays}d)`
    };
  }
  const mos = Math.round(diffDays / 30);
  return {
    pillClass: "safe",
    icon: "✅",
    text: `${mos} months left`
  };
}

export default function BatchListCard({
  batches = [],
  loading = false,
  sortBy,
  sortDirection,
  onSort,
  canEdit = false,
  onEdit,
  canDelete = false,
  onDelete,
  page = 1,
  totalPages = 1,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange
}) {
  return (
    <div className="batches-table-card">
      <div className="batches-table-wrapper">
        <table className="batches-table">
          <thead>
            <tr>
              <SortableTh
                column="batchnumber"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
              >
                Batch #
              </SortableTh>

              <SortableTh
                column="medicinename"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
              >
                Medicine Name
              </SortableTh>

              <th>Mfg Date</th>

              <SortableTh
                column="expirydate"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
              >
                Expiry Date &amp; Status
              </SortableTh>

              <SortableTh
                column="remainingquantity"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
              >
                Stock Remaining
              </SortableTh>

              <SortableTh
                column="unitcost"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
              >
                Unit Cost
              </SortableTh>

              <th>Total Value</th>

              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="batches-loading-cell">
                  Loading batches and expiry records...
                </td>
              </tr>
            ) : batches.length === 0 ? (
              <tr>
                <td colSpan="8" className="batches-empty-cell">
                  No batches found matching your filters.
                </td>
              </tr>
            ) : (
              batches.map((batch) => {
                const expiryInfo = getExpiryInfo(batch.expiryDate);
                const initial = batch.initialQuantity || 1;
                const remaining = batch.remainingQuantity || 0;
                const pct = Math.min(100, Math.max(0, Math.round((remaining / initial) * 100)));

                const progressColor =
                  remaining <= 0
                    ? "red"
                    : pct <= 20
                    ? "amber"
                    : "green";

                const totalValue = remaining * (batch.unitCost || 0);

                return (
                  <tr key={batch.id}>
                    <td>
                      <span className="batch-number-badge">{batch.batchNumber}</span>
                    </td>
                    <td>
                      <span className="batch-med-name">
                        {batch.medicineName || `Medicine #${batch.medicineId}`}
                      </span>
                    </td>
                    <td style={{ color: "#64748b" }}>
                      {formatDate(batch.manufacturingDate)}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                          {formatDate(batch.expiryDate)}
                        </span>
                        <span className={`expiry-pill ${expiryInfo.pillClass}`}>
                          <span>{expiryInfo.icon}</span>
                          <span>{expiryInfo.text}</span>
                        </span>
                      </div>
                    </td>
                    <td className="stock-bar-cell">
                      <div className="stock-bar-meta">
                        <span className="stock-bar-count">
                          {remaining} <span style={{ color: "#94a3b8", fontWeight: "normal" }}>/ {initial}</span>
                        </span>
                        <span className="stock-bar-pct">{pct}%</span>
                      </div>
                      <div className="stock-progress-track">
                        <div
                          className={`stock-progress-fill ${progressColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td style={{ fontWeight: "600", color: "#334155" }}>
                      PKR {Number(batch.unitCost || 0).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: "600", color: "#152614" }}>
                      PKR {totalValue.toLocaleString()}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {canEdit && onEdit && (
                        <button
                          type="button"
                          className="batch-action-btn edit"
                          onClick={() => onEdit(batch)}
                          title="Edit Batch"
                        >
                          Edit
                        </button>
                      )}

                      {canDelete && onDelete && (
                        <button
                          type="button"
                          className="batch-action-btn delete"
                          onClick={() => onDelete(batch)}
                          title="Delete Batch"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        loading={loading}
      />
    </div>
  );
}
