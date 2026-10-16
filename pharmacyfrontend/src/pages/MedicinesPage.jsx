import { useState, useEffect, useCallback } from "react";
import { medicinesApi, categoriesApi, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";

import "../styles/medicines.css";

// Modular Reusable Components
import TableToolbar from "../components/common/TableToolbar";
import ConfirmModal from "../components/common/ConfirmModal";
import MedicineModal from "../components/medicines/MedicineModal";
import MedicineListCard from "../components/medicines/MedicineListCard";

export default function MedicinesPage() {
  const { isAdmin, isStoreManager, isPharmacist, roleId } = useAuth();

  // Role permissions:
  // - Only Admin can delete
  // - Admin, StoreManager, and Pharmacist can edit
  const canDelete = Boolean(isAdmin || roleId === 1);
  const canEdit = Boolean(isAdmin || isStoreManager || isPharmacist || roleId === 1 || roleId === 2 || roleId === 3);

  // Data states
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Query & Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Delete confirmation state
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load categories for modals
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await categoriesApi.getAll({ pageSize: 100, isActive: true });
        setCategories(res.data?.items || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Fetch medicines with current parameters
  const fetchMedicines = useCallback(async () => {
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

      const res = await medicinesApi.getAll(params);
      setMedicines(res.data?.items || []);
      setTotalCount(res.data?.totalCount || 0);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, isActive, sortBy, sortDirection]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

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
    setSelectedMedicine(null);
    setModalError("");
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (med) => {
    setModalMode("edit");
    setSelectedMedicine(med);
    setModalError("");
    setIsModalOpen(true);
  };

  // Submit modal form (Add or Edit)
  const handleModalSubmit = async (formData) => {
    setModalSubmitting(true);
    setModalError("");

    try {
      if (modalMode === "create") {
        await medicinesApi.create({
          medicineCode: formData.medicineCode.trim(),
          name: formData.name.trim(),
          genericName: formData.genericName?.trim() || null,
          description: formData.description?.trim() || null,
          categoryId: Number(formData.categoryId),
          reorderLevel: Number(formData.reorderLevel) || 0
        });
        setFeedback("Medicine added successfully.");
      } else {
        await medicinesApi.update(formData.id, {
          medicineCode: formData.medicineCode.trim(),
          name: formData.name.trim(),
          genericName: formData.genericName?.trim() || null,
          description: formData.description?.trim() || null,
          categoryId: Number(formData.categoryId),
          reorderLevel: Number(formData.reorderLevel) || 0,
          isActive: formData.isActive
        });
        setFeedback("Medicine updated successfully.");
      }

      setIsModalOpen(false);
      fetchMedicines();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setModalSubmitting(false);
    }
  };

  // Confirm delete (Admin only)
  const handleDeleteConfirm = async () => {
    if (!medicineToDelete) return;
    setDeleting(true);
    try {
      await medicinesApi.delete(medicineToDelete.id);
      setFeedback(`Medicine "${medicineToDelete.name}" deleted.`);
      setMedicineToDelete(null);
      fetchMedicines();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="decent-page-container">
      {/* Reusable Toolbar: Header, Search, Active/Inactive Dropdown, and Add Button */}
      <TableToolbar
        title="Medicines"
        subtitle={`${totalCount} total medicines registered in inventory`}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        statusFilter={isActive}
        onStatusFilterChange={(val) => {
          setIsActive(val);
          setPage(1);
        }}
        onClearFilters={() => {
          setSearch("");
          setIsActive("");
          setPage(1);
        }}
        onAddClick={handleOpenAdd}
        addLabel="+ Add Medicine"
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
            fontSize: "13px",
            marginBottom: "14px"
          }}
        >
          {feedback}
        </div>
      )}

      {error && <div className="decent-error-box">{error}</div>}

      {/* Clean Table Card */}
      <MedicineListCard
        medicines={medicines}
        loading={loading}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
        canEdit={canEdit}
        onEdit={handleOpenEdit}
        canDelete={canDelete}
        onDelete={(med) => setMedicineToDelete(med)}
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

      {/* Add / Edit Modal Component */}
      <MedicineModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedMedicine}
        categories={categories}
        onSubmit={handleModalSubmit}
        onClose={() => setIsModalOpen(false)}
        loading={modalSubmitting}
        error={modalError}
      />

      {/* Delete Confirmation Modal (Admin Only) */}
      <ConfirmModal
        isOpen={Boolean(medicineToDelete)}
        title="Delete Medicine"
        message={`Are you sure you want to delete ${medicineToDelete?.name} (${medicineToDelete?.medicineCode})?`}
        note="Only administrators have permission to delete medicines."
        confirmLabel="Delete Medicine"
        onConfirm={handleDeleteConfirm}
        onClose={() => setMedicineToDelete(null)}
        loading={deleting}
        danger={true}
      />
    </div>
  );
}
