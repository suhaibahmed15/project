import { useState, useEffect, useCallback, useMemo } from "react";
import { purchasesApi, suppliersApi, medicinesApi, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "../styles/purchases.css";
import "../styles/common.css";

// Child components
import PurchaseStatsCards from "../components/purchases/PurchaseStatsCards";
import CreatePurchaseModal from "../components/purchases/CreatePurchaseModal";
import PurchaseDetailsModal from "../components/purchases/PurchaseDetailsModal";
import ConfirmModal from "../components/common/ConfirmModal";

export default function PurchasesPage() {
  const { isAdmin, isStoreManager, isPharmacist, roleId } = useAuth();

  // Role permissions:
  // - Only Admin can delete purchases
  // - Admin and StoreManager can create purchases
  // - Pharmacist can only view purchases
  const canDelete = Boolean(isAdmin || roleId === 1 || roleId === "1");
  const canCreate = Boolean(
    isAdmin ||
    isStoreManager ||
    roleId === 1 ||
    roleId === 2 ||
    roleId === "1" ||
    roleId === "2"
  );

  // Data states
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load supporting dropdown data (Suppliers & Medicines)
  useEffect(() => {
    async function loadMeta() {
      try {
        const [supRes, medRes] = await Promise.all([
          suppliersApi.getAll({ pageSize: 100 }),
          medicinesApi.getAll({ pageSize: 150 })
        ]);
        setSuppliers(supRes.data?.items || supRes.data || []);
        setMedicines(medRes.data?.items || medRes.data || []);
      } catch (err) {
        console.error("Failed to load metadata:", err);
      }
    }
    loadMeta();
  }, []);

  // Fetch Purchases List
  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await purchasesApi.getAll();
      const data = res.data?.items || res.data || [];
      // Sort newest purchases first
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.purchaseDate || a.createdAt);
        const dateB = new Date(b.purchaseDate || b.createdAt);
        return dateB - dateA;
      });
      setPurchases(sorted);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // Client-side filtering
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      // Search match
      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.purchaseNumber?.toLowerCase().includes(query) ||
        p.supplierName?.toLowerCase().includes(query) ||
        p.notes?.toLowerCase().includes(query);

      // Supplier match
      const matchSupplier =
        !supplierFilter ||
        String(p.supplierId) === String(supplierFilter);

      return matchSearch && matchSupplier;
    });
  }, [purchases, search, supplierFilter]);

  // Pagination calculation
  const totalItems = filteredPurchases.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPurchases.slice(start, start + pageSize);
  }, [filteredPurchases, currentPage, pageSize]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, supplierFilter]);

  // Formatters
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0
    }).format(Number(val) || 0).replace("PKR", "Rs.");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString("en-PK", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
  };

  // Handle Create Purchase
  const handleCreateSubmit = async (payload) => {
    setCreateSubmitting(true);
    setCreateError("");
    try {
      await purchasesApi.create(payload);
      setIsCreateOpen(false);
      setFeedback(`Purchase order "${payload.purchaseNumber}" recorded successfully!`);
      setTimeout(() => setFeedback(""), 4500);
      fetchPurchases();
    } catch (err) {
      setCreateError(getErrorMessage(err));
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Handle Delete Purchase
  const handleDeleteConfirm = async () => {
    if (!purchaseToDelete) return;
    setDeleting(true);
    try {
      await purchasesApi.delete(purchaseToDelete.id);
      setFeedback(`Purchase order "${purchaseToDelete.purchaseNumber}" deleted.`);
      setTimeout(() => setFeedback(""), 3500);
      setPurchaseToDelete(null);
      fetchPurchases();
    } catch (err) {
      setError(getErrorMessage(err));
      setPurchaseToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="purchases-page-container">
      {/* Page Header */}
      <div className="purchases-header">
        <div>
          <h1 className="purchases-title">Purchase Orders & Invoices</h1>
          <p className="purchases-subtitle">
            Manage procurement orders, monitor vendor billing, and view received stock batches.
          </p>
        </div>

        <div className="purchases-header-actions">
          {canCreate && (
            <button
              type="button"
              className="btn-record-purchase"
              onClick={() => {
                setCreateError("");
                setIsCreateOpen(true);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Record Purchase
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {feedback && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
            padding: "8px 14px",
            borderRadius: "6px",
            fontSize: "13px",
            marginBottom: "14px"
          }}
        >
          {feedback}
        </div>
      )}

      {error && (
        <div className="decent-error-box" style={{ marginBottom: "14px" }}>
          {error}
        </div>
      )}

      {/* KPI Stats Cards */}
      <PurchaseStatsCards purchases={purchases} />

      {/* Toolbar & Filters */}
      <div className="purchases-toolbar">
        <div className="purchases-toolbar-left">
          {/* Search */}
          <div className="purchases-search-wrapper">
            <span className="purchases-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="purchases-search-input"
              placeholder="Search PO #, supplier, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Supplier Dropdown Filter */}
          <select
            className="purchases-select-filter"
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            aria-label="Filter by supplier"
          >
            <option value="">All Suppliers</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {(Boolean(search) || Boolean(supplierFilter)) && (
          <button
            type="button"
            className="btn-clear-filters"
            onClick={() => {
              setSearch("");
              setSupplierFilter("");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Purchases Data Table */}
      <div className="purchases-table-card">
        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
            <div className="decent-loading-spinner" style={{ margin: "0 auto 12px auto" }} />
            Loading purchase records...
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="purchases-empty-state">
            <div className="purchases-empty-icon">📦</div>
            <h3 className="purchases-empty-title">No Purchase Orders Found</h3>
            <p className="purchases-empty-desc">
              {search || supplierFilter
                ? "No purchase records matched your search filters. Try clearing filters or using another keyword."
                : "No purchases have been recorded yet. Click 'Record Purchase' to add your first supplier invoice."}
            </p>
            {canCreate && !search && !supplierFilter && (
              <button
                type="button"
                className="btn-record-purchase"
                style={{ marginTop: "16px" }}
                onClick={() => setIsCreateOpen(true)}
              >
                + Record Purchase Order
              </button>
            )}
          </div>
        ) : (
          <div className="purchases-table-wrapper">
            <table className="purchases-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th>Purchase Date</th>
                  <th>Items Count</th>
                  <th>Total Amount</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPurchases.map((purchase) => {
                  const itemCount = purchase.purchaseItems?.reduce(
                    (sum, it) => sum + (Number(it.quantity) || 0),
                    0
                  ) || 0;
                  const lineCount = purchase.purchaseItems?.length || 0;

                  return (
                    <tr key={purchase.id}>
                      {/* PO Number */}
                      <td>
                        <span className="purchase-number-badge">
                          {purchase.purchaseNumber}
                        </span>
                      </td>

                      {/* Supplier */}
                      <td>
                        <div className="purchase-supplier-tag">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                          <span>{purchase.supplierName || `Supplier #${purchase.supplierId}`}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ color: "#64748b", fontSize: "13px" }}>
                        {formatDate(purchase.purchaseDate)}
                      </td>

                      {/* Items */}
                      <td>
                        <span className="purchase-items-count">
                          {lineCount} {lineCount === 1 ? "line" : "lines"} ({itemCount} units)
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td>
                        <span className="purchase-amount-cell">
                          {formatCurrency(purchase.totalAmount)}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td>
                        <div className="purchase-actions-cell">
                          {/* View Details */}
                          <button
                            type="button"
                            className="btn-action-view"
                            onClick={() => {
                              setSelectedPurchase(purchase);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </button>

                          {/* Delete (Admin Only) */}
                          {canDelete && (
                            <button
                              type="button"
                              className="decent-action-btn delete"
                              onClick={() => setPurchaseToDelete(purchase)}
                              title="Delete Purchase"
                              aria-label={`Delete purchase ${purchase.purchaseNumber}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && filteredPurchases.length > 0 && (
          <div className="decent-pagination">
            <span className="decent-pagination-info">
              Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{" "}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems} purchase orders
            </span>

            <div className="decent-pagination-btns">
              <button
                type="button"
                className="decent-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  className={`decent-page-btn ${currentPage === pg ? "active" : ""}`}
                  onClick={() => setCurrentPage(pg)}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                className="decent-page-btn"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Purchase Modal */}
      <CreatePurchaseModal
        isOpen={isCreateOpen}
        suppliers={suppliers}
        medicines={medicines}
        onSubmit={handleCreateSubmit}
        onClose={() => setIsCreateOpen(false)}
        loading={createSubmitting}
        error={createError}
      />

      {/* View Purchase Details Modal */}
      <PurchaseDetailsModal
        isOpen={isDetailsOpen}
        purchase={selectedPurchase}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedPurchase(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(purchaseToDelete)}
        title="Delete Purchase Order"
        message={`Are you sure you want to delete purchase "${purchaseToDelete?.purchaseNumber}" from ${purchaseToDelete?.supplierName || "Supplier"}?`}
        note="This will remove the purchase record from the system. Admin action only."
        confirmLabel="Delete Purchase"
        danger={true}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setPurchaseToDelete(null)}
      />
    </div>
  );
}
