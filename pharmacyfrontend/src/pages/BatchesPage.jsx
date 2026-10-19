import { useState, useEffect, useMemo, useCallback } from "react";
import { batchesApi, medicinesApi, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import BatchStatsCards from "../components/batches/BatchStatsCards";
import BatchListCard from "../components/batches/BatchListCard";
import BatchModal from "../components/batches/BatchModal";
import ConfirmModal from "../components/common/ConfirmModal";
import "../styles/batches.css";

export default function BatchesPage() {
  const { isAdmin, isStoreManager, isPharmacist, roleId } = useAuth();

  const canDelete = Boolean(isAdmin || roleId === 1);
  const canEdit = Boolean(isAdmin || isStoreManager || isPharmacist || roleId === 1 || roleId === 2 || roleId === 3);
  const canCreate = Boolean(isAdmin || isStoreManager || roleId === 1 || roleId === 2);

  // Data states
  const [batches, setBatches] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [medicineFilter, setMedicineFilter] = useState("");

  // Sort & Pagination
  const [sortBy, setSortBy] = useState("expirydate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Fetch data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [batchesRes, medsRes] = await Promise.all([
        batchesApi.getAll(),
        medicinesApi.getAll({ pageSize: 1000 })
      ]);

      const batchesList = Array.isArray(batchesRes.data)
        ? batchesRes.data
        : batchesRes.data?.items || [];
      const medsList = Array.isArray(medsRes.data)
        ? medsRes.data
        : medsRes.data?.items || [];

      setBatches(batchesList);
      setMedicines(medsList);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err) || "Failed to load batches and medicines.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
    setPage(1);
  };

  // Filter & Sort Logic
  const filteredAndSortedBatches = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let list = [...batches];

    // 1. Text Search (Batch Number, Medicine Name)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.batchNumber?.toLowerCase().includes(q) ||
          b.medicineName?.toLowerCase().includes(q)
      );
    }

    // 2. Expiry Status Filter
    if (expiryFilter !== "all") {
      list = list.filter((b) => {
        const exp = new Date(b.expiryDate);
        exp.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

        if (expiryFilter === "expired") return diffDays < 0;
        if (expiryFilter === "near") return diffDays >= 0 && diffDays <= 30;
        if (expiryFilter === "warning") return diffDays >= 0 && diffDays <= 90;
        if (expiryFilter === "safe") return diffDays > 90;
        return true;
      });
    }

    // 3. Stock Filter
    if (stockFilter === "inStock") {
      list = list.filter((b) => (b.remainingQuantity || 0) > 0);
    } else if (stockFilter === "outOfStock") {
      list = list.filter((b) => (b.remainingQuantity || 0) <= 0);
    }

    // 4. Medicine Filter
    if (medicineFilter) {
      list = list.filter((b) => String(b.medicineId) === String(medicineFilter));
    }

    // 5. Sorting
    list.sort((a, b) => {
      let valA, valB;

      if (sortBy === "batchnumber") {
        valA = (a.batchNumber || "").toLowerCase();
        valB = (b.batchNumber || "").toLowerCase();
      } else if (sortBy === "medicinename") {
        valA = (a.medicineName || "").toLowerCase();
        valB = (b.medicineName || "").toLowerCase();
      } else if (sortBy === "remainingquantity") {
        valA = a.remainingQuantity || 0;
        valB = b.remainingQuantity || 0;
      } else if (sortBy === "unitcost") {
        valA = a.unitCost || 0;
        valB = b.unitCost || 0;
      } else {
        // default: expirydate
        valA = new Date(a.expiryDate || 0).getTime();
        valB = new Date(b.expiryDate || 0).getTime();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [batches, search, expiryFilter, stockFilter, medicineFilter, sortBy, sortDirection]);

  // Paginated Slicing
  const totalCount = filteredAndSortedBatches.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedBatches = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredAndSortedBatches.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedBatches, page, pageSize]);

  // Modal Handlers
  const handleOpenAdd = () => {
    setSelectedBatch(null);
    setModalMode("create");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (batch) => {
    setSelectedBatch(batch);
    setModalMode("edit");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    setModalSubmitting(true);
    setModalError("");
    try {
      if (modalMode === "create") {
        await batchesApi.create(data);
        setFeedback(`Batch "${data.batchNumber}" created successfully.`);
      } else {
        await batchesApi.update(selectedBatch.id, data);
        setFeedback(`Batch "${data.batchNumber}" updated successfully.`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setModalError(getErrorMessage(err) || "Failed to save batch.");
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!batchToDelete) return;
    setDeleting(true);
    try {
      await batchesApi.delete(batchToDelete.id);
      setFeedback(`Batch "${batchToDelete.batchNumber}" deleted successfully.`);
      setBatchToDelete(null);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to delete batch.");
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setExpiryFilter("all");
    setStockFilter("all");
    setMedicineFilter("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || expiryFilter !== "all" || stockFilter !== "all" || medicineFilter
  );

  return (
    <div className="batches-page-container">
      {/* Header */}
      <div className="batches-header">
        <div>
          <h1 className="batches-title">Batches &amp; Expiry Monitor</h1>
          <p className="batches-subtitle">
            FEFO inventory management, batch lifecycle tracking, and expiry alerts
          </p>
        </div>

        <div className="batches-header-actions">
          {canCreate && (
            <button
              type="button"
              className="btn-add-batch"
              onClick={handleOpenAdd}
            >
              + Add Batch
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {feedback && (
        <div className="batches-alert success">
          <span>✅ {feedback}</span>
          <button
            type="button"
            className="batches-alert-close"
            onClick={() => setFeedback("")}
          >
            &times;
          </button>
        </div>
      )}

      {error && (
        <div className="batches-alert error">
          <span>⚠️ {error}</span>
          <button
            type="button"
            className="batches-alert-close"
            onClick={() => setError("")}
          >
            &times;
          </button>
        </div>
      )}

      {/* 5 KPI Summary Cards */}
      <BatchStatsCards batches={batches} loading={loading} />

      {/* Toolbar / Filters */}
      <div className="batches-toolbar">
        <div className="batches-toolbar-left">
          {/* Search */}
          <input
            type="text"
            className="batch-search-input"
            placeholder="Search by batch # or medicine..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {/* Expiry Status Filter */}
          <select
            className="batch-filter-select"
            value={expiryFilter}
            onChange={(e) => {
              setExpiryFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by expiry status"
          >
            <option value="all">All Expiry Statuses</option>
            <option value="near">Near Expiry (≤ 30 Days)</option>
            <option value="warning">Expiring Soon (≤ 90 Days)</option>
            <option value="expired">Expired Batches</option>
            <option value="safe">Safe &amp; Valid (&gt; 90 Days)</option>
          </select>

          {/* Stock Filter */}
          <select
            className="batch-filter-select"
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by stock"
          >
            <option value="all">All Stock Levels</option>
            <option value="inStock">In Stock (Remaining &gt; 0)</option>
            <option value="outOfStock">Depleted / Zero Stock</option>
          </select>

          {/* Medicine Filter */}
          <select
            className="batch-filter-select"
            value={medicineFilter}
            onChange={(e) => {
              setMedicineFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by medicine"
          >
            <option value="">All Medicines</option>
            {medicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="batch-clear-btn"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Batches Table Card */}
      <BatchListCard
        batches={paginatedBatches}
        loading={loading}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
        canEdit={canEdit}
        onEdit={handleOpenEdit}
        canDelete={canDelete}
        onDelete={(batch) => setBatchToDelete(batch)}
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

      {/* Create / Edit Batch Modal */}
      <BatchModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedBatch}
        medicines={medicines}
        onSubmit={handleModalSubmit}
        onClose={() => setIsModalOpen(false)}
        loading={modalSubmitting}
        error={modalError}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(batchToDelete)}
        title="Delete Batch"
        message={`Are you sure you want to delete batch "${batchToDelete?.batchNumber}" for ${batchToDelete?.medicineName || "medicine"}?`}
        note="This will soft-delete the batch record. Only administrators have permission to delete batches."
        confirmLabel="Delete Batch"
        onConfirm={handleDeleteConfirm}
        onClose={() => setBatchToDelete(null)}
        loading={deleting}
        danger={true}
      />
    </div>
  );
}
