import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const { login, logout, isAuthenticated, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogout = () => {
    logout();
    setEmail("");
    setPassword("");
    setInfoMessage("You have been logged out.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const currentRole = user?.role || role || "User";

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo-icon" style={{ margin: "0 auto 12px auto" }}>Rx</div>
          <h2>Pharmacy Stock &amp; Expiry Monitor</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}
        {infoMessage && (
          <div
            style={{
              backgroundColor: "#dcfce7",
              color: "#166534",
              border: "1px solid #bbf7d0",
              padding: "10px 14px",
              borderRadius: "4px",
              fontSize: "13px",
              marginBottom: "18px",
              textAlign: "center"
            }}
          >
            {infoMessage}
          </div>
        )}

        {/* If already logged in, show current session banner with Logout button */}
        {isAuthenticated && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "14px",
              marginBottom: "18px",
              textAlign: "center"
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#475569" }}>
              Active session as <strong>{currentRole}</strong> ({user?.email || "User"})
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#ffffff",
                  backgroundColor: "#dc2626",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
              <Link
                to="/"
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#0f172a",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  textDecoration: "none"
                }}
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="simple-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. pharmacist@pharmacy.com"
              required
              autoFocus
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-control"
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: "8px" }}
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        {/* Direct Logout / Clear Session button */}
        
      </div>
    </div>
  );
}
