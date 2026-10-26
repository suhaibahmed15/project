import { useState, useEffect, useCallback } from "react";
import { suppliersApi, purchasesApi, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "../styles/suppliers.css";

// Components
import SupplierStatsGrid from "../components/suppliers/SupplierStatsGrid";
import SupplierListCard from "../components/suppliers/SupplierListCard";
import SupplierModal from "../components/suppliers/SupplierModal";
import ConfirmModal from "../components/common/ConfirmModal";

export default function SuppliersPage() {
  const { isAdmin, isStoreManager, roleId } = useAuth();

  // Role permissions:
  // - Admin & Store Manager can create & edit
  // - Only Admin can delete
  const canDelete = Boolean(isAdmin || roleId === 1 || roleId === "1");
  const canEdit = Boolean(
    isAdmin ||
    isStoreManager ||
    roleId === 1 ||
    roleId === 2 ||
    roleId === "1" ||
    roleId === "2"
  );
  const canCreate = canEdit;

  // Data states
  const [suppliers, setSuppliers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Counts & Stats
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  // Query & Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Delete confirmation
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load KPI counts
  const loadStats = useCallback(async () => {
    try {
      const [activeRes, inactiveRes, purchasesRes] = await Promise.all([
        suppliersApi.getAll({ pageSize: 1, isActive: true }),
        suppliersApi.getAll({ pageSize: 1, isActive: false }),
        purchasesApi.getAll()
      ]);

      setActiveCount(activeRes.data?.totalCount ?? 0);
      setInactiveCount(inactiveRes.data?.totalCount ?? 0);

      const purchaseItems = purchasesRes.data?.items || purchasesRes.data || [];
      setTotalOrdersCount(Array.isArray(purchaseItems) ? purchaseItems.length : 0);
    } catch (err) {
      console.error("Failed to load supplier stats:", err);
    }
  }, []);

  // Fetch Suppliers List
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        pageSize,
        sortBy,
        sortDirection
      };

      if (search.trim()) params.search = search.trim();
      if (isActive !== "") params.isActive = isActive === "true";

      const res = await suppliersApi.getAll(params);
      const data = res.data?.items || res.data || [];
      setSuppliers(Array.isArray(data) ? data : []);
      setTotalCount(res.data?.totalCount || 0);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, isActive, sortBy, sortDirection]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Sort handler
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
    setPage(1);
  };

  // Open modal for Create
  const handleOpenAdd = () => {
    setModalMode("create");
    setSelectedSupplier(null);
    setModalError("");
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (sup) => {
    setModalMode("edit");
    setSelectedSupplier(sup);
    setModalError("");
    setIsModalOpen(true);
  };

  // Submit Add / Edit
  const handleModalSubmit = async (formData) => {
    setModalSubmitting(true);
    setModalError("");

    try {
      if (modalMode === "create") {
        await suppliersApi.create({
          name: formData.name.trim(),
          contactPerson: formData.contactPerson?.trim() || null,
          phone: formData.phone?.trim() || null,
          email: formData.email?.trim() || null,
          address: formData.address?.trim() || null
        });
        setFeedback(`Supplier "${formData.name}" registered successfully.`);
      } else {
        await suppliersApi.update(selectedSupplier.id, {
          name: formData.name.trim(),
          contactPerson: formData.contactPerson?.trim() || null,
          phone: formData.phone?.trim() || null,
          email: formData.email?.trim() || null,
          address: formData.address?.trim() || null,
          isActive: formData.isActive
        });
        setFeedback(`Supplier "${formData.name}" updated successfully.`);
      }

      setIsModalOpen(false);
      fetchSuppliers();
      loadStats();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setModalSubmitting(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (sup) => {
    try {
      const updatedStatus = !sup.isActive;
      await suppliersApi.update(sup.id, {
        name: sup.name,
        contactPerson: sup.contactPerson || null,
        phone: sup.phone || null,
        email: sup.email || null,
        address: sup.address || null,
        isActive: updatedStatus
      });

      setFeedback(
        `Supplier "${sup.name}" marked as ${updatedStatus ? "Active" : "Inactive"}.`
      );
      fetchSuppliers();
      loadStats();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Confirm Delete (Admin Only)
  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return;
    setDeleting(true);
    try {
      await suppliersApi.delete(supplierToDelete.id);
      setFeedback(`Supplier "${supplierToDelete.name}" deleted.`);
      setSupplierToDelete(null);
      fetchSuppliers();
      loadStats();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setError(getErrorMessage(err));
      setSupplierToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="suppliers-page-container">
      {/* Page Header */}
      <div className="decent-page-header">
        <div>
          <h1 className="decent-page-title">Suppliers &amp; Vendors</h1>
          <p className="decent-page-subtitle">
            Manage pharmaceutical manufacturers, distributors, procurement channels, and contact details
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <SupplierStatsGrid
        totalCount={totalCount}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        totalOrdersCount={totalOrdersCount}
      />

      {/* Notifications */}
      {feedback && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
            padding: "8px 14px",
            borderRadius: "6px",
            fontSize: "13px"
          }}
        >
          {feedback}
        </div>
      )}

      {error && (
        <div className="decent-error-box">
          {error}
        </div>
      )}

      {/* Toolbar: Search, Status Filter, Add Button */}
      <div className="supplier-toolbar">
        <div className="supplier-toolbar-left">
          {/* Search */}
          <div className="supplier-search-wrapper">
            <span className="supplier-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="supplier-search-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search supplier, contact, phone..."
            />
          </div>

          {/* Status Filter */}
          <select
            className="supplier-select-filter"
            value={isActive}
            onChange={(e) => {
              setIsActive(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          {/* Clear Filter */}
          {(Boolean(search) || isActive !== "") && (
            <button
              type="button"
              className="supplier-btn-clear"
              onClick={() => {
                setSearch("");
                setIsActive("");
                setPage(1);
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {canCreate && (
          <button
            type="button"
            className="btn-add-supplier"
            onClick={handleOpenAdd}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ Add Supplier</span>
          </button>
        )}
      </div>

      {/* Clean Table List Card (No cards - List only!) */}
      <SupplierListCard
        suppliers={suppliers}
        loading={loading}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
        canEdit={canEdit}
        onEdit={handleOpenEdit}
        canDelete={canDelete}
        onDelete={(s) => setSupplierToDelete(s)}
        onToggleStatus={handleToggleStatus}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />

      {/* Add / Edit Supplier Modal */}
      <SupplierModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedSupplier}
        onSubmit={handleModalSubmit}
        onClose={() => setIsModalOpen(false)}
        loading={modalSubmitting}
        error={modalError}
      />

      {/* Delete Confirmation Modal (Admin only) */}
      <ConfirmModal
        isOpen={Boolean(supplierToDelete)}
        title="Delete Supplier"
        message={`Are you sure you want to delete supplier "${supplierToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Supplier"
        onConfirm={handleDeleteConfirm}
        onClose={() => setSupplierToDelete(null)}
        loading={deleting}
        danger={true}
      />
    </div>
  );
}
