import "../../styles/categories.css";

export default function CategoryStatsGrid({
  totalCount = 0,
  activeCount = 0,
  inactiveCount = 0,
  medicinesCount = 0
}) {
  return (
    <div className="category-stats-grid">
      {/* Total Categories */}
      <div className="category-stat-card">
        <div className="category-stat-info">
          <span className="category-stat-label">Total Categories</span>
          <span className="category-stat-value">{totalCount}</span>
          <span className="category-stat-sub">Classifications registered</span>
        </div>
        <div className="category-stat-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>

      {/* Active Categories */}
      <div className="category-stat-card">
        <div className="category-stat-info">
          <span className="category-stat-label">Active</span>
          <span className="category-stat-value">{activeCount}</span>
          <span className="category-stat-sub">Available for medicines</span>
        </div>
        <div className="category-stat-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
      </div>

      {/* Inactive / Archived */}
      <div className="category-stat-card">
        <div className="category-stat-info">
          <span className="category-stat-label">Inactive</span>
          <span className="category-stat-value">{inactiveCount}</span>
          <span className="category-stat-sub">Disabled or archived</span>
        </div>
        <div className="category-stat-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
      </div>

      {/* Medicines Linked */}
      <div className="category-stat-card">
        <div className="category-stat-info">
          <span className="category-stat-label">Medicines Linked</span>
          <span className="category-stat-value">{medicinesCount}</span>
          <span className="category-stat-sub">Across all active categories</span>
        </div>
        <div className="category-stat-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7h-7L11 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
