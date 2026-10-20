import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";
import PharmacyLogo from "../components/common/PharmacyLogo";
import "../styles/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const { login, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogout = () => {
    logout();
    setEmail("");
    setPassword("");
    setInfoMessage("You have been logged out.");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Please contact your System Administrator to reset your pharmacy credentials.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const currentRole = user?.roleId ? `Role ID: ${user.roleId}` : "User";

  return (
    <div className="login-page-wrapper">
      {/* Main Split Content */}
      <div className="login-container">
        {/* Left Column: Brand Identity */}
        <div className="login-brand-col">
          <div className="login-brand-logo-wrapper">
            <PharmacyLogo width={88} height={76} />
          </div>

          <h1 className="login-brand-title">Pharmacy</h1>
          <div className="login-brand-subtitle-row">
            <span className="login-highlight-orange">Stock And Expiry</span>{" "}
            <span className="login-highlight-navy">Monitor</span>
          </div>

          <p className="login-brand-tagline">
            <span>Track Stock</span>
            <span className="login-tagline-dot">•</span>
            <span>Manage Expiry</span>
            <span className="login-tagline-dot">•</span>
            <span>Ensure Better Health</span>
          </p>
        </div>

        {/* Right Column: Floating Login Card */}
        <div className="login-card-col">
          <div className="login-card">
            <div className="login-card-header">
              <h2 className="login-welcome-title">Welcome Back</h2>
              <p className="login-welcome-desc">Sign in to your account to continue</p>
            </div>

            {/* Error & Info Alerts */}
            {error && (
              <div className="login-error-alert">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {infoMessage && <div className="login-info-alert">{infoMessage}</div>}

            {/* Active session info if user is already authenticated */}
            {isAuthenticated && (
              <div className="login-session-card">
                <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#475569" }}>
                  Active session as <strong>{currentRole}</strong> ({user?.email || "Logged in"})
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
                      borderRadius: "6px",
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
                      color: "#152614",
                      backgroundColor: "#F1F5F9",
                      border: "1px solid #E2E8F0",
                      borderRadius: "6px",
                      textDecoration: "none"
                    }}
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Username or Email Input */}
              <div className="input-with-icon">
                <span className="input-leading-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username or Email"
                  required
                  autoFocus
                  className="login-field"
                  aria-label="Username or Email"
                />
              </div>

              {/* Password Input with Visibility Toggle */}
              <div className="input-with-icon">
                <span className="input-leading-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="login-field has-trailing"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-trailing-icon"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="login-options-row">
                <label className="login-remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="login-checkbox"
                  />
                  <span>Remember me</span>
                </label>

                <a
                  href="#forgot"
                  onClick={handleForgotPassword}
                  className="login-forgot-link"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                <span>{loading ? "Signing in..." : "Login"}</span>
                {/* {!loading && <span className="login-arrow-icon">→</span>} */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
