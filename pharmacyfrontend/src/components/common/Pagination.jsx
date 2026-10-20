import "../../styles/common.css";

export default function Pagination({
  page = 1,
  totalPages = 1,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  loading = false
}) {
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  // Generate page numbers array with limit of 5 around current page
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.min(totalPages, page + 2)
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
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </button>

        {pageNumbers.map((p) => (
          <button
            key={p}
            type="button"
            className="decent-btn"
            style={{
              fontWeight: p === page ? "700" : "500",
              backgroundColor: p === page ? "#152614" : "#ffffff",
              color: p === page ? "#ffffff" : "#334155",
              borderColor: p === page ? "#152614" : "#E2E8F0"
            }}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="decent-btn"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
