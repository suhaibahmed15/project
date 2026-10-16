import { Link } from "react-router-dom";
import "../styles/statusPages.css";

export default function ErrorPage({ message }) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="status-page-screen">
      <div className="status-card">
        <div className="status-icon-badge danger">⚠️</div>
        <span className="status-code">500 Server Error</span>
        <h1 className="status-title">Something Went Wrong</h1>
        <p className="status-desc">
          {message || "An unexpected error occurred while processing your request. Please try again."}
        </p>
        <div className="status-actions">
          <button className="btn btn-secondary" onClick={handleReload}>
            ↻ Reload Page
          </button>
          <Link to="/" className="btn btn-primary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
