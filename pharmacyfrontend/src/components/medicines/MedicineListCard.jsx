import SortableTh from "../common/SortableTh";
import Pagination from "../common/Pagination";
import "../../styles/medicines.css";

export default function MedicineListCard({
  medicines = [],
  loading = false,
  sortBy,
  sortDirection,
  onSort,
  canEdit = false,
  onEdit,
  canDelete = false,
  onDelete,
  page,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange
}) {
  return (
    <div className="decent-table-card">
      <table className="decent-table">
        <thead>
          <tr>
            <SortableTh
              column="medicinecode"
              currentSortBy={sortBy}
              currentSortDirection={sortDirection}
              onSort={onSort}
            >
              Code
            </SortableTh>

            <SortableTh
              column="name"
              currentSortBy={sortBy}
              currentSortDirection={sortDirection}
              onSort={onSort}
            >
              Medicine Name
            </SortableTh>

            <th>Generic Name</th>
            <th>Category</th>

            <SortableTh
              column="currentstock"
              currentSortBy={sortBy}
              currentSortDirection={sortDirection}
              onSort={onSort}
            >
              Current Stock
            </SortableTh>

            <SortableTh
              column="reorderlevel"
              currentSortBy={sortBy}
              currentSortDirection={sortDirection}
              onSort={onSort}
            >
              Reorder
            </SortableTh>

            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="decent-loading-cell">
                Loading medicines...
              </td>
            </tr>
          ) : medicines.length === 0 ? (
            <tr>
              <td colSpan="8" className="decent-empty-cell">
                No medicines found.
              </td>
            </tr>
          ) : (
            medicines.map((med) => {
              return (
                <tr key={med.id}>
                  <td>
                    <span className="decent-code">{med.medicineCode}</span>
                  </td>
                  <td className="decent-name">{med.name}</td>
                  <td className="decent-muted">{med.genericName || "—"}</td>
                  <td>{med.categoryName || "—"}</td>
                  <td>
                    <span
                      className={`decent-stock ${
                        (med.currentStock ?? 0) <= 0
                          ? "out"
                          : (med.currentStock ?? 0) <= med.reorderLevel
                          ? "low"
                          : "ok"
                      }`}
                    >
                      {(med.currentStock ?? 0).toLocaleString()} units
                    </span>
                  </td>
                  <td className="decent-muted">{med.reorderLevel}</td>
                  <td>
                    <span
                      className={`decent-status ${
                        med.isActive ? "active" : "inactive"
                      }`}
                    >
                      {med.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    {canEdit && onEdit && (
                      <button
                        type="button"
                        className="decent-action-btn edit"
                        onClick={() => onEdit(med)}
                        title={`Edit ${med.name}`}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                    )}

                    {canDelete && onDelete && (
                      <button
                        type="button"
                        className="decent-action-btn delete"
                        onClick={() => onDelete(med)}
                        title={`Delete ${med.name}`}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

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
