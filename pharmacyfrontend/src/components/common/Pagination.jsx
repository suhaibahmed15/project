import "../../styles/common.css";

export default function Pagination({
  page,
  currentPage,
  totalPages = 1,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  loading = false
}) {
  const activePage = Number(currentPage ?? page ?? 1) || 1;
  const startItem = totalCount === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const endItem = Math.min(activePage * pageSize, totalCount);

  // Generate page numbers array with limit of 5 around current page
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, activePage - 3),
    Math.min(totalPages, activePage + 2)
  );

  return (
    <div className="decent-pagination">
      <div className="decent-pagination-text">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
        <strong>{totalCount}</strong> records
      </div>

      <div className="decent-pagination-btns" style={{ alignItems: "center" }}>
        {onPageSizeChange && (
          <select
            className="decent-select"
            style={{ padding: "4px 8px", fontSize: "12px", height: "30px" }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Items per page"
          >
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </select>
        )}

        <button
          type="button"
          className="decent-btn"
          disabled={activePage <= 1 || loading}
          onClick={() => onPageChange(Math.max(1, activePage - 1))}
        >
          Previous
        </button>

        {pageNumbers.map((p) => (
          <button
            key={p}
            type="button"
            className="decent-btn"
            style={{
              fontWeight: p === activePage ? "700" : "500",
              backgroundColor: p === activePage ? "#152614" : "#ffffff",
              color: p === activePage ? "#ffffff" : "#334155",
              borderColor: p === activePage ? "#152614" : "#E2E8F0"
            }}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="decent-btn"
          disabled={activePage >= totalPages || loading}
          onClick={() => onPageChange(Math.min(totalPages, activePage + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
