import { Link, useNavigate } from "react-router-dom";
import "../styles/statusPages.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="status-page-screen">
      <div className="status-card">
        <div className="status-icon-badge info">🔍</div>
        <span className="status-code">404 Not Found</span>
        <h1 className="status-title">Page Not Found</h1>
        <p className="status-desc">
          The page you are looking for doesn't exist, was removed, or is temporarily unavailable.
        </p>
        <div className="status-actions">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            &larr; Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
