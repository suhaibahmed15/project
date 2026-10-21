import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7092/api";

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

// Medicines endpoints
export const medicinesApi = {
  getAll: (params) => client.get("/Medicine", { params }),
  getById: (id) => client.get(`/Medicine/${id}`),
  create: (data) => client.post("/Medicine", data),
  update: (id, data) => client.put(`/Medicine/${id}`, data),
  delete: (id) => client.delete(`/Medicine/${id}`)
};

// Categories endpoints (for dropdowns and filtering)
export const categoriesApi = {
  getAll: (params) => client.get("/Category", { params }),
  getById: (id) => client.get(`/Category/${id}`),
  create: (data) => client.post("/Category", data),
  update: (id, data) => client.put(`/Category/${id}`, data),
  delete: (id) => client.delete(`/Category/${id}`)
};

// Batches endpoints
export const batchesApi = {
  getAll: (params) => client.get("/Batch", { params }),
  getById: (id) => client.get(`/Batch/${id}`),
  getByMedicine: (medicineId) => client.get(`/Batch/medicine/${medicineId}`),
  create: (data) => client.post("/Batch", data),
  update: (id, data) => client.put(`/Batch/${id}`, data),
  delete: (id) => client.delete(`/Batch/${id}`)
};

// Suppliers endpoints
export const suppliersApi = {
  getAll: (params) => client.get("/Supplier", { params }),
  getById: (id) => client.get(`/Supplier/${id}`),
  create: (data) => client.post("/Supplier", data),
  update: (id, data) => client.put(`/Supplier/${id}`, data),
  delete: (id) => client.delete(`/Supplier/${id}`)
};

// Purchases endpoints
export const purchasesApi = {
  getAll: (params) => client.get("/Purchase", { params }),
  getById: (id) => client.get(`/Purchase/${id}`),
  create: (data) => client.post("/Purchase", data),
  delete: (id) => client.delete(`/Purchase/${id}`)
};

// Stock Transactions endpoints
export const stockTransactionsApi = {
  getAll: (params) => client.get("/StockTransaction", { params }),
  getById: (id) => client.get(`/StockTransaction/${id}`),
  create: (data) => client.post("/StockTransaction", data)
};

// Alerts endpoints
export const alertsApi = {
  getAll: (params) => client.get("/Alert", { params }),
  getById: (id) => client.get(`/Alert/${id}`),
  markAsRead: (id) => client.put(`/Alert/${id}/read`),
  resolve: (id) => client.put(`/Alert/${id}/resolve`),
  create: (data) => client.post("/Alert", data)
};

// Dashboard endpoints
export const dashboardApi = {
  getSummary: () => client.get("/Dashboard/summary")
};

// Intelligence / Prediction endpoints
export const intelligenceApi = {
  getAll: () => client.get("/Intelligence"),
  getById: (id) => client.get(`/Intelligence/${id}`),
  create: (data) => client.post("/Intelligence", data),
  evaluate: (data) => client.post("/Intelligence/evaluate", data)
};

// User Management endpoints
export const usersApi = {
  getAll: () => client.get("/User"),
  getById: (id) => client.get(`/User/${id}`),
  create: (data) => client.post("/User", data),
  assignRole: (id, roleData) => client.post(`/User/${id}/role`, roleData),
  delete: (id) => client.delete(`/User/${id}`)
};

// Role Management endpoints
export const rolesApi = {
  getAll: () => client.get("/Role"),
  create: (data) => client.post("/Role", data),
  delete: (roleId) => client.delete(`/Role/${roleId}`)
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
