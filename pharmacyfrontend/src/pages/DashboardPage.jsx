import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const rawRole = user?.role || role || "Pharmacist";
  const formattedRole =
    rawRole === "StoreManager"
      ? "Store Manager"
      : rawRole.replace(/([A-Z])/g, " $1").trim() || "Pharmacist";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "24px",
        textAlign: "center"
      }}
    >
      <h1
        style={{
          fontSize: "40px",
          fontWeight: "700",
          color: "#0f172a",
          margin: "0 0 24px 0"
        }}
      >
        Welcome, {formattedRole}!
      </h1>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          padding: "10px 28px",
          fontSize: "15px",
          fontWeight: "600",
          color: "#ffffff",
          backgroundColor: "#dc2626",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "background-color 0.15s ease",
          boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)"
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
      >
        Logout
      </button>
    </div>
  );
}
