import { createContext, useContext, useState } from "react";
import { authApi } from "../api/client";

// This function reads the information stored inside a JWT token
function parseJwt(token) {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Auto-migrate legacy stored user with "role" to "roleId"
      if (parsed && parsed.roleId === undefined) {
        const rName = parsed.role || "Admin";
        parsed.roleId =
          rName === "Admin" ? 1 : rName === "StoreManager" ? 2 : rName === "Pharmacist" ? 3 : 1;
        delete parsed.role;
        localStorage.setItem("user", JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const data = response.data;
    const newToken = data?.token;

    if (!newToken) {
      throw new Error("No token returned by the server.");
    }

    const decoded = parseJwt(newToken);
    const rawRoleClaim =
      decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded?.role ||
      data?.role ||
      "Admin";
    const roleName = Array.isArray(rawRoleClaim) ? rawRoleClaim[0] : rawRoleClaim;

    let roleId = data?.roleId ?? (decoded?.roleId ? Number(decoded.roleId) : null);
    if (roleId === null || roleId === undefined) {
      if (String(roleName).toLowerCase() === "admin") roleId = 1;
      else if (String(roleName).toLowerCase() === "storemanager") roleId = 2;
      else if (String(roleName).toLowerCase() === "pharmacist") roleId = 3;
      else roleId = 1;
    }

    const userObj = {
      userId: data?.userId || decoded?.nameid || decoded?.sub,
      email: data?.email || credentials.email,
      fullName: data?.fullName || decoded?.unique_name || credentials.email.split("@")[0],
      roleId: Number(roleId)
    };

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userObj));
    setToken(newToken);
    setUser(userObj);

    return { token: newToken, user: userObj };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  const userRoleId =
    user?.roleId ??
    (user?.role === "Admin" ? 1 : user?.role === "StoreManager" ? 2 : user?.role === "Pharmacist" ? 3 : 1);

  const roleName =
    userRoleId === 1 ? "Admin" : userRoleId === 2 ? "StoreManager" : userRoleId === 3 ? "Pharmacist" : "User";

  const isAuthenticated = Boolean(token);

  const value = {
    token,
    user,
    roleId: userRoleId,
    role: userRoleId,
    roleName,
    isAuthenticated,
    isAdmin: userRoleId === 1,
    isStoreManager: userRoleId === 2,
    isPharmacist: userRoleId === 3,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook exported directly from context file
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
