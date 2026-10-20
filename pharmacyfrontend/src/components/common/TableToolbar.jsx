import "../../styles/common.css";

export default function TableToolbar({
  title,
  subtitle,
  search = "",
  onSearchChange,
  statusFilter = "",
  onStatusFilterChange,
  onClearFilters,
  onAddClick,
  addLabel = "+ Add"
}) {
  const hasActiveFilters = Boolean(search || statusFilter !== "");

  return (
    <div>
      {/* Header with Title and Add Button */}
      <div className="decent-page-header">
        <div>
          <h1 className="decent-page-title">{title}</h1>
          {subtitle && <p className="decent-page-subtitle">{subtitle}</p>}
        </div>

        {onAddClick && (
          <button type="button" className="decent-add-btn" onClick={onAddClick}>
            {addLabel}
          </button>
        )}
      </div>

      {/* Filter Row: Search & Status Dropdown */}
      <div className="decent-toolbar">
        <div className="decent-toolbar-left">
          {onSearchChange && (
            <input
              type="text"
              className="decent-search-input"
              placeholder={`Search ${title?.toLowerCase() || "records"}...`}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          )}

          {onStatusFilterChange && (
            <select
              className="decent-select"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              aria-label="Filter status"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          )}
        </div>

        {hasActiveFilters && onClearFilters && (
          <button type="button" className="decent-btn" onClick={onClearFilters}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
