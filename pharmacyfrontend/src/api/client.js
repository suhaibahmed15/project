import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5135/api";

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Automatically attach JWT token to every outgoing request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials) => client.post("/Auth/login", credentials)
};

// Helper for readable error messages
export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (typeof error.response?.data === "string") return error.response.data;
  if (error.response?.data?.title) return error.response.data.title;
  if (error.message) return error.message;
  return "An unexpected error occurred.";
}

export default client;
