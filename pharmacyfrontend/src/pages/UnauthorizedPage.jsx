import { Link, useNavigate } from "react-router-dom";
import "../styles/statusPages.css";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="status-page-screen">
      <div className="status-card">
        <div className="status-icon-badge warning">🔒</div>
        <span className="status-code">403 Forbidden</span>
        <h1 className="status-title">Access Denied</h1>
        <p className="status-desc">
          You do not have permission to view this page or perform this action.
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
