import { useState, useEffect, useCallback } from "react";
import { categoriesApi, medicinesApi, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";

import "../styles/categories.css";

// Modular Components
import CategoryStatsGrid from "../components/categories/CategoryStatsGrid";
import CategoryListCard from "../components/categories/CategoryListCard";
import CategoryModal from "../components/categories/CategoryModal";
import ConfirmModal from "../components/common/ConfirmModal";

export default function CategoriesPage() {
  const { isAdmin, isStoreManager, isPharmacist, roleId } = useAuth();

  // Role permissions:
  // - Only Admin can delete categories
  // - Admin, StoreManager, and Pharmacist can create and edit
  const canDelete = Boolean(isAdmin || roleId === 1 || roleId === "1");
  const canEdit = Boolean(
    isAdmin ||
    isStoreManager ||
    isPharmacist ||
    roleId === 1 ||
    roleId === 2 ||
    roleId === 3 ||
    roleId === "1" ||
    roleId === "2" ||
    roleId === "3"
  );

  // Data states
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Medicine association counts
  const [medicineCounts, setMedicineCounts] = useState({});
  const [totalMedicinesCategorized, setTotalMedicinesCategorized] = useState(0);

  // Stats
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  // Query & Pagination states - Default to Category ID ascending for serial order
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Delete confirmation state
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load accurate active and inactive counts directly from DB via totalCount
  const loadCategoryCounts = useCallback(async () => {
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        categoriesApi.getAll({ pageSize: 1, isActive: true }),
        categoriesApi.getAll({ pageSize: 1, isActive: false })
      ]);
      setActiveCount(activeRes.data?.totalCount ?? 0);
      setInactiveCount(inactiveRes.data?.totalCount ?? 0);
    } catch (err) {
      console.warn("Could not load category counts:", err);
    }
  }, []);

  useEffect(() => {
    loadCategoryCounts();
  }, [loadCategoryCounts]);

  // Load medicines to compute counts per category
  const loadMedicineCounts = useCallback(async () => {
    try {
      const res = await medicinesApi.getAll({ pageSize: 100 });
      const items = res.data?.items || [];
      const counts = {};
      items.forEach((m) => {
        if (m.categoryId) {
          counts[m.categoryId] = (counts[m.categoryId] || 0) + 1;
        }
      });
      setMedicineCounts(counts);
      setTotalMedicinesCategorized(items.length);
    } catch (err) {
      console.warn("Could not load medicines count for categories:", err);
    }
  }, []);

  useEffect(() => {
    loadMedicineCounts();
  }, [loadMedicineCounts]);

  // Fetch categories with filtering and sorting
  const fetchCategories = useCallback(async () => {
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

      const res = await categoriesApi.getAll(params);
      const items = res.data?.items || [];
      const count = res.data?.totalCount || 0;
      const pages = res.data?.totalPages || 1;

      setCategories(items);
      setTotalCount(count);
      setTotalPages(pages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, isActive, sortBy, sortDirection]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Sort toggle handler
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
    setSelectedCategory(null);
    setModalError("");
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (cat) => {
    setModalMode("edit");
    setSelectedCategory(cat);
    setModalError("");
    setIsModalOpen(true);
  };

  // Submit modal form (Add or Edit)
  const handleModalSubmit = async (formData) => {
    setModalSubmitting(true);
    setModalError("");

    try {
      if (modalMode === "create") {
        await categoriesApi.create({
          name: formData.name.trim(),
          description: formData.description?.trim() || null
        });
        setFeedback(`Category "${formData.name.trim()}" created successfully.`);
      } else {
        await categoriesApi.update(formData.id, {
          name: formData.name.trim(),
          description: formData.description?.trim() || null,
          isActive: formData.isActive
        });
        setFeedback(`Category "${formData.name.trim()}" updated successfully.`);
      }

      setIsModalOpen(false);
      fetchCategories();
      loadMedicineCounts();
      loadCategoryCounts();
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setModalSubmitting(false);
    }
  };

  // Quick toggle Active/Inactive status
  const handleToggleStatus = async (cat) => {
    try {
      await categoriesApi.update(cat.id, {
        name: cat.name,
        description: cat.description,
        isActive: !cat.isActive
      });
      setFeedback(
        `Category "${cat.name}" is now ${!cat.isActive ? "Active" : "Inactive"}.`
      );
      fetchCategories();
      loadCategoryCounts();
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Confirm delete (Admin only)
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await categoriesApi.delete(categoryToDelete.id);
      setFeedback(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategoryToDelete(null);
      fetchCategories();
      loadMedicineCounts();
      loadCategoryCounts();
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const hasActiveFilters = Boolean(search || isActive !== "");

  return (
    <div className="category-page-container">
      {/* Page Header Banner */}
      <div className="category-header-card">
        <div className="category-title-group">
          <div>
            <h1 className="category-page-title">Medicine Categories</h1>
            <p className="category-page-subtitle">
              Classify pharmaceuticals by therapeutic action, chemical group, and prescription schedule
            </p>
          </div>
        </div>

        <div className="category-header-actions">
          {canEdit && (
            <button
              type="button"
              className="category-add-btn"
              onClick={handleOpenAdd}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Category
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Row */}
      <CategoryStatsGrid
        totalCount={totalCount}
        activeCount={activeCount || categories.filter((c) => c.isActive).length}
        inactiveCount={inactiveCount}
        medicinesCount={totalMedicinesCategorized}
      />

      {/* Filter & View Toolbar */}
      <div className="category-toolbar">
        <div className="category-toolbar-left">
          {/* Search Input */}
          <div className="category-search-wrapper">
            <svg
              className="category-search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="category-search-input"
              placeholder="Search categories by name or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Status Dropdown */}
          <select
            className="category-status-select"
            value={isActive}
            onChange={(e) => {
              setIsActive(e.target.value);
              setPage(1);
            }}
            aria-label="Filter status"
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              className="category-btn-subtle"
              onClick={() => {
                setSearch("");
                setIsActive("");
                setPage(1);
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="category-toolbar-right">
          {/* Refresh button */}
          <button
            type="button"
            className="category-btn-subtle"
            onClick={() => {
              fetchCategories();
              loadMedicineCounts();
            }}
            title="Refresh category list"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Notifications */}
      {feedback && (
        <div className="category-feedback-box">
          <span>{feedback}</span>
          <button
            type="button"
            className="category-feedback-close"
            onClick={() => setFeedback("")}
          >
            &times;
          </button>
        </div>
      )}

      {error && (
        <div className="category-feedback-box error">
          <span>{error}</span>
          <button
            type="button"
            className="category-feedback-close"
            onClick={() => setError("")}
          >
            &times;
          </button>
        </div>
      )}

      {/* Categories Table Component */}
      <CategoryListCard
        categories={categories}
        medicineCounts={medicineCounts}
        loading={loading}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
        canEdit={canEdit}
        onEdit={handleOpenEdit}
        canDelete={canDelete}
        onDelete={(cat) => setCategoryToDelete(cat)}
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

      {/* Add / Edit Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedCategory}
        onSubmit={handleModalSubmit}
        onClose={() => setIsModalOpen(false)}
        loading={modalSubmitting}
        error={modalError}
      />

      {/* Delete Confirmation Modal (Admin only) */}
      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
        note={
          medicineCounts[categoryToDelete?.id]
            ? `Warning: There are ${medicineCounts[categoryToDelete?.id]} medicines linked to this category. Deleting it will mark it as deleted.`
            : "This action will archive this category and remove it from active selection."
        }
        confirmLabel="Delete Category"
        onConfirm={handleDeleteConfirm}
        onClose={() => setCategoryToDelete(null)}
        loading={deleting}
        danger={true}
      />
    </div>
  );
}
