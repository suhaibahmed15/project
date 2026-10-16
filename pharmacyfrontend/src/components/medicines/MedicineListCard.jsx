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
              column="stock"
              currentSortBy={sortBy}
              currentSortDirection={sortDirection}
              onSort={onSort}
            >
              Stock
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
              const isOut = med.currentStock <= 0;
              const isLow = !isOut && med.currentStock <= med.reorderLevel;

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
                        isOut ? "out" : isLow ? "low" : "ok"
                      }`}
                    >
                      {med.currentStock}
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
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && onDelete && (
                      <button
                        type="button"
                        className="decent-action-btn delete"
                        onClick={() => onDelete(med)}
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
