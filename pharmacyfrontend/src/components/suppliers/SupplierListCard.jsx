import SortableTh from "../common/SortableTh";
import Pagination from "../common/Pagination";
import "../../styles/suppliers.css";

export default function SupplierListCard({
  suppliers = [],
  loading = false,
  sortBy = "id",
  sortDirection = "asc",
  onSort,
  canEdit = true,
  onEdit,
  canDelete = false,
  onDelete,
  onToggleStatus,
  page = 1,
  totalPages = 1,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange
}) {
  // Only show Actions column if the user has rights to edit, toggle or delete
  const hasActions = Boolean((canEdit && (onEdit || onToggleStatus)) || (canDelete && onDelete));

  return (
    <div className="supplier-table-card">
      <div className="supplier-table-wrapper">
        <table className="supplier-table">
          <thead>
            <tr>
              <SortableTh
                column="id"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
                style={{ width: "75px" }}
              >
                Supplier ID
              </SortableTh>

              <SortableTh
                column="name"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
                style={{ minWidth: hasActions ? "135px" : "175px" }}
              >
                Supplier Name
              </SortableTh>

              <SortableTh
                column="contactperson"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
                style={{ minWidth: hasActions ? "110px" : "135px" }}
              >
                Contact Person
              </SortableTh>

              <SortableTh
                column="phone"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
                style={{ minWidth: "105px" }}
              >
                Phone
              </SortableTh>

              <SortableTh
                column="email"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
                style={{ minWidth: hasActions ? "135px" : "175px" }}
              >
                Email
              </SortableTh>

              <SortableTh
                column="address"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
                style={{ minWidth: hasActions ? "125px" : "170px" }}
              >
                Address
              </SortableTh>

              <SortableTh
                column="isactive"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
                style={{ width: "90px" }}
              >
                Status
              </SortableTh>

              {hasActions && (
                <th style={{ textAlign: "right", width: "175px" }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={hasActions ? 8 : 7} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  Loading suppliers...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={hasActions ? 8 : 7} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  No suppliers found. Click &quot;+ Add Supplier&quot; to register a new vendor.
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id}>
                  {/* Plain text ID - strictly no colored box */}
                  <td style={{ width: "75px" }}>
                    <span className="supplier-id-plain">#{s.id}</span>
                  </td>

                  <td>
                    <span className="supplier-name-bold">{s.name}</span>
                  </td>

                  <td>
                    <span className="supplier-contact-name">
                      {s.contactPerson || "—"}
                    </span>
                  </td>

                  <td>
                    <span className="supplier-meta-text">
                      {s.phone || "—"}
                    </span>
                  </td>

                  <td>
                    <span className="supplier-meta-text">
                      {s.email || "—"}
                    </span>
                  </td>

                  <td>
                    <div className="supplier-address-clamp" title={s.address || ""}>
                      {s.address || "—"}
                    </div>
                  </td>

                  <td>
                    <span className={`supplier-status-badge ${s.isActive ? "active" : "inactive"}`}>
                      <span className={`supplier-status-dot ${s.isActive ? "active" : "inactive"}`} />
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {hasActions && (
                    <td style={{ textAlign: "right" }}>
                      <div className="supplier-actions-cell">
                        {canEdit && onEdit && (
                          <button
                            type="button"
                            className="supplier-action-btn edit"
                            onClick={() => onEdit(s)}
                            title={`Edit ${s.name}`}
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

                        {canEdit && onToggleStatus && (
                          <button
                            type="button"
                            className="supplier-action-btn toggle"
                            onClick={() => onToggleStatus(s)}
                            title={s.isActive ? "Deactivate Supplier" : "Activate Supplier"}
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
                              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                              <line x1="12" y1="2" x2="12" y2="12" />
                            </svg>
                            <span>{s.isActive ? "Deactivate" : "Activate"}</span>
                          </button>
                        )}

                        {canDelete && onDelete && (
                          <button
                            type="button"
                            className="supplier-action-btn delete"
                            onClick={() => onDelete(s)}
                            title={`Delete ${s.name}`}
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
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <Pagination
        page={page}
        currentPage={page}
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
