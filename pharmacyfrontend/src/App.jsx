import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import ErrorPage from "./pages/ErrorPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";

import AlertsPage from "./pages/AlertsPage";
import BatchesPage from "./pages/BatchesPage";
import NotFoundPage from "./pages/NotFoundPage";

import MedicinesPage from "./pages/MedicinesPage";
import DashboardPage from "./pages/DashboardPage";
import PurchasesPage from "./pages/PurchasesPage";
import SuppliersPage from "./pages/SuppliersPage";

import CategoriesPage from "./pages/CategoriesPage";
import StockLedgerPage from "./pages/StockLedgerPage";
import IntelligencePage from "./pages/IntelligencePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

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
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/batch" element={<BatchesPage />} />
              <Route path="/batches" element={<BatchesPage />} />
              
              <Route path="/purchase" element={<PurchasesPage />} />
              <Route path="/ledger" element={<StockLedgerPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/medicines" element={<MedicinesPage />} />
              
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/transactions" element={<StockLedgerPage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />

              {/* Admin Only User Management Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/user" element={<UsersPage />} />
                <Route path="/users" element={<UsersPage />} />
              </Route>

              <Route path="/error" element={<ErrorPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
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

