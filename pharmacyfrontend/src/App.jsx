import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
// import ManagerOrAdminRoute from "./components/ManagerOrAdminRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MedicinesPage from "./pages/MedicinesPage";
import BatchesPage from "./pages/BatchesPage";
import AlertsPage from "./pages/AlertsPage";
import IntelligencePage from "./pages/IntelligencePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
import UsersPage from "./pages/UsersPage";
import StockLedgerPage from "./pages/StockLedgerPage";
import PurchasesPage from "./pages/PurchasesPage";
import CategoriesPage from "./pages/CategoriesPage";
import SuppliersPage from "./pages/SuppliersPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes (inside Layout with Sidebar and Topbar) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/medicines" element={<MedicinesPage />} />
              <Route path="/batches" element={<BatchesPage />} />
              <Route path="/batch" element={<BatchesPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/transactions" element={<StockLedgerPage />} />
              <Route path="/ledger" element={<StockLedgerPage />} />
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/purchase" element={<PurchasesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />

              {/* Admin Only User Management Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/user" element={<UsersPage />} />
              </Route>

              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/error" element={<ErrorPage />} />
            </Route>
          </Route>

          {/* Public Fallbacks */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}





























