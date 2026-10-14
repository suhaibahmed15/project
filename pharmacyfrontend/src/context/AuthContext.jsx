
import { createContext, useContext, useState } from "react";
import { authApi } from "../api/client";

//This function reads the information stored inside a JWT token also you can say Simple helper to decode JWT payload without external libraries
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
      return stored ? JSON.parse(stored) : null;
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
    const roleClaim =
      decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded?.role ||
      data?.role ||
      "User";

    const userObj = {
      userId: data?.userId || decoded?.nameid || decoded?.sub,
      email: data?.email || credentials.email,
      fullName: data?.fullName || decoded?.unique_name || credentials.email.split("@")[0],
      role: Array.isArray(roleClaim) ? roleClaim[0] : roleClaim
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

  const role = user?.role || "";
  const isAuthenticated = Boolean(token);

  const value = {
    token,
    user,
    role,
    isAuthenticated,
    isAdmin: role.toLowerCase() === "admin",
    isStoreManager: role.toLowerCase() === "storemanager",
    isPharmacist: role.toLowerCase() === "pharmacist",
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook exported directly from context file (Standard React practice)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
