import "../../styles/medicines.css";

export default function SortableTh({
  column,
  currentSortBy,
  currentSortDirection,
  onSort,
  children,
  style
}) {
  const isActive = currentSortBy === column;

  return (
    <th
      className="decent-sort-th"
      onClick={() => onSort(column)}
      style={style}
      title={`Click to sort by ${children}`}
    >
      {children}
      <span className={`sort-icon ${isActive ? "active" : ""}`}>
        {!isActive ? "⬍" : currentSortDirection === "asc" ? "▲" : "▼"}
      </span>
    </th>
  );
}
