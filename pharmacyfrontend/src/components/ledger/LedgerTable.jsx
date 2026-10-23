import SortableTh from "../common/SortableTh";
import Pagination from "../common/Pagination";

function getTransactionTypeMeta(type) {
  const num = Number(type);
  if (num === 1 || String(type).toLowerCase() === "stockin") {
    return { label: "Stock In", className: "badge-stock-in", prefix: "+" };
  }
  if (num === 2 || String(type).toLowerCase() === "stockout") {
    return { label: "Stock Out", className: "badge-stock-out", prefix: "-" };
  }
  if (num === 3 || String(type).toLowerCase() === "adjustment") {
    return { label: "Adjustment", className: "badge-adjustment", prefix: "±" };
  }
  if (num === 4 || String(type).toLowerCase() === "transfer") {
    return { label: "Transfer", className: "badge-transfer", prefix: "⇄" };
  }
  return { label: "Movement", className: "badge-adjustment", prefix: "" };
}

export default function LedgerTable({
  transactions = [],
  medicines = [],
  batches = [],
  users = [],
  loading = false,
  sortBy,
  sortDirection,
  onSort,
  page,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange
}) {
  const getUserInfo = (userId, createdByName, userFullName) => {
    if (createdByName && isNaN(Number(createdByName))) return createdByName;
    if (userFullName && isNaN(Number(userFullName))) return userFullName;
    if (!userId) return "System";

    const user = users.find((u) => String(u.id) === String(userId));
    if (user && user.fullName) return user.fullName;
    if (user && user.name) return user.name;
    if (user && user.userName) return user.userName;

    if (String(userId) === "1") return "System Administrator";
    if (String(userId) === "2") return "Store Manager";
    if (String(userId) === "3") return "Lead Pharmacist";

    if (isNaN(Number(userId))) return userId;

    return createdByName || userFullName || `User #${userId}`;
  };

  const getMedicineInfo = (medId) => {
    const med = medicines.find((m) => m.id === medId);
    return med ? `${med.name} (${med.medicineCode})` : `Medicine #${medId}`;
  };

  const getBatchInfo = (batchId) => {
    if (!batchId) return "—";
    const batch = batches.find((b) => b.id === batchId);
    return batch ? `Batch #${batch.batchNumber}` : `Batch #${batchId}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div>
      <div className="ledger-table-wrapper">
        <table className="ledger-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>Ref ID</th>
              <SortableTh
                column="createdAt"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
              >
                Date &amp; Time
              </SortableTh>
              <SortableTh
                column="medicine"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
              >
                Target Medicine
              </SortableTh>
              <th>Batch</th>
              <SortableTh
                column="type"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
              >
                Movement Type
              </SortableTh>
              <SortableTh
                column="quantity"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
                style={{ textAlign: "right" }}
              >
                Quantity
              </SortableTh>
              <th style={{ textAlign: "center" }}>Balance Shift</th>
              <th>Reason &amp; Notes</th>
              <th>Audit Log</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  Loading stock transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="ledger-empty-state">
                    <p style={{ fontWeight: 600, color: "#1e293b", margin: "0 0 4px 0" }}>
                      No ledger transactions found.
                    </p>
                    <p style={{ margin: 0, fontSize: "12.5px" }}>
                      Stock receipts, dispensations, and balance adjustments will be recorded here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((t) => {
                const meta = getTransactionTypeMeta(t.transactionType);
                const isPositive = meta.prefix === "+";
                const isNegative = meta.prefix === "-";

                return (
                  <tr key={t.id}>
                    <td>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#64748b" }}>
                        #{t.id}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(t.createdAt)}</td>
                    <td>
                      <strong style={{ color: "#0f172a" }}>{getMedicineInfo(t.medicineId)}</strong>
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ fontSize: "11.5px" }}>
                        {getBatchInfo(t.batchId)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-movement ${meta.className}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        className={
                          isPositive
                            ? "qty-delta-positive"
                            : isNegative
                            ? "qty-delta-negative"
                            : "qty-delta-neutral"
                        }
                      >
                        {meta.prefix}
                        {t.quantity}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div className="balance-shift-box">
                        <span className="balance-old">{t.previousQuantity}</span>
                        <span className="balance-arrow">&rarr;</span>
                        <span className="balance-new">{t.newQuantity}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: "240px" }}>
                      <span style={{ fontSize: "12px", color: "#475569" }}>
                        {t.reason || "Standard stock movement"}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "12px", color: "#0f172a", fontWeight: 500 }}>
                          {getUserInfo(t.createdBy, t.createdByName, t.userFullName)}
                        </span>
                        {t.isAdminOverride && (
                          <span
                            style={{
                              fontSize: "10.5px",
                              color: "#d97706",
                              fontWeight: 700,
                              textTransform: "uppercase"
                            }}
                          >
                            Admin Override
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {transactions.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          loading={loading}
        />
      )}
    </div>
  );
}
