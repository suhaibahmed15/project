import SortableTh from "../common/SortableTh";
import Pagination from "../common/Pagination";
import "../../styles/categories.css";

export default function CategoryListCard({
  categories = [],
  medicineCounts = {},
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
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="category-table-card">
      <div className="category-table-wrapper">
        <table className="category-table">
          <thead>
            <tr>
              <SortableTh
                column="id"
                currentSortBy={sortBy}
                currentSortDirection={sortDirection}
                onSort={onSort}
                style={{ width: "80px" }}
              >
                Category ID
              </SortableTh>

                <SortableTh
                  column="name"
                  currentSortBy={sortBy}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Category Name
                </SortableTh>

                <th>Description</th>

                <th>Medicines Linked</th>

                <SortableTh
                  column="isactive"
                  currentSortBy={sortBy}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                  style={{ width: "100px" }}
                >
                  Status
                </SortableTh>

                <SortableTh
                  column="createdat"
                  currentSortBy={sortBy}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                  style={{ width: "115px" }}
                >
                  Created Date
                </SortableTh>

                <th style={{ textAlign: "right", width: "175px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="decent-loading-cell">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="7" className="decent-empty-cell">
                    No categories found. Click &quot;+ Add Category&quot; to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const medCount = medicineCounts[cat.id] ?? 0;
                  return (
                    <tr key={cat.id}>
                      <td style={{ width: "80px" }}>
                        <span className="category-id-plain">
                          #{cat.id}
                        </span>
                      </td>

                      <td>
                        <span className="category-name-text">{cat.name}</span>
                      </td>

                      <td>
                        <div className="category-desc-text" title={cat.description || ""}>
                          {cat.description || "—"}
                        </div>
                      </td>

                      <td>
                        <span className="category-med-count" title={`${medCount} medicines assigned`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 7h-7L11 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                          </svg>
                          {medCount} {medCount === 1 ? "medicine" : "medicines"}
                        </span>
                      </td>

                      <td>
                        <span className={`category-status-badge ${cat.isActive ? "active" : "inactive"}`}>
                          <span className={`category-status-dot ${cat.isActive ? "active" : "inactive"}`} />
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td style={{ color: "#64748b", fontSize: "13px", whiteSpace: "nowrap" }}>
                        {formatDate(cat.createdAt)}
                      </td>

                      <td className="category-actions-cell">
                        {canEdit && onToggleStatus && (
                          <button
                            type="button"
                            className="category-action-btn toggle"
                            onClick={() => onToggleStatus(cat)}
                            title={cat.isActive ? "Deactivate category" : "Activate category"}
                          >
                            {cat.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}

                        {canEdit && onEdit && (
                          <button
                            type="button"
                            className="category-action-btn edit"
                            onClick={() => onEdit(cat)}
                            title={`Edit ${cat.name}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>
                        )}

                        {canDelete && onDelete && (
                          <button
                            type="button"
                            className="category-action-btn delete"
                            onClick={() => onDelete(cat)}
                            title={`Delete ${cat.name}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
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
