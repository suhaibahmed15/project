export default function LedgerToolbar({
  typeFilter,
  onTypeFilterChange,
  medicineFilter,
  onMedicineFilterChange,
  medicines = [],
  search,
  onSearchChange,
  onOpenRecordModal,
  totalCount,
  counts = {}
}) {
  return (
    <div className="ledger-toolbar">
      {/* Top Controls Row */}
      <div className="ledger-toolbar-row">
        {/* Type Filter Chips */}
        <div className="ledger-chip-group">
          <button
            type="button"
            className={`ledger-chip-btn ${typeFilter === "all" ? "active" : ""}`}
            onClick={() => onTypeFilterChange("all")}
          >
            All ({counts.all ?? totalCount})
          </button>
          <button
            type="button"
            className={`ledger-chip-btn ${typeFilter === "1" ? "active" : ""}`}
            onClick={() => onTypeFilterChange("1")}
          >
            Stock In ({counts.stockIn ?? 0})
          </button>
          <button
            type="button"
            className={`ledger-chip-btn ${typeFilter === "2" ? "active" : ""}`}
            onClick={() => onTypeFilterChange("2")}
          >
            Stock Out ({counts.stockOut ?? 0})
          </button>
          <button
            type="button"
            className={`ledger-chip-btn ${typeFilter === "3" ? "active" : ""}`}
            onClick={() => onTypeFilterChange("3")}
          >
            Adjustments ({counts.adjustment ?? 0})
          </button>
        </div>

        {/* Search & Medicine Dropdown */}
        <div className="ledger-controls-group">
          <select
            className="ledger-select"
            value={medicineFilter}
            onChange={(e) => onMedicineFilterChange(e.target.value)}
            aria-label="Filter by medicine"
          >
            <option value="">All Medicines</option>
            {medicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.medicineCode})
              </option>
            ))}
          </select>

          <input
            type="text"
            className="ledger-search-input"
            placeholder="Search by medicine, batch, or ref..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
