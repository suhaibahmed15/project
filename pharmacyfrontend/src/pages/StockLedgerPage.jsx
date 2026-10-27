import { useState, useEffect, useMemo, useCallback } from "react";
import { stockTransactionsApi, medicinesApi, batchesApi, usersApi, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import LedgerStatsCards from "../components/ledger/LedgerStatsCards";
import LedgerToolbar from "../components/ledger/LedgerToolbar";
import LedgerTable from "../components/ledger/LedgerTable";
import RecordTransactionModal from "../components/ledger/RecordTransactionModal";
import "../styles/ledger.css";

export default function StockLedgerPage() {
  const { isAdmin, roleId } = useAuth();
  const isUserAdmin = Boolean(isAdmin || roleId === 1 || roleId === "1");

  const [transactions, setTransactions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Filter & Search & Sort states
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [medicineFilter, setMedicineFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const promises = [
        stockTransactionsApi.getAll(),
        medicinesApi.getAll({ pageSize: 100 }),
        batchesApi.getAll({ pageSize: 100 })
      ];

      // Only fetch user directory if current user has Admin privileges
      if (isUserAdmin) {
        promises.push(usersApi.getAll());
      }

      const results = await Promise.allSettled(promises);
      const txRes = results[0];
      const medsRes = results[1];
      const batchRes = results[2];
      const usersRes = isUserAdmin ? results[3] : null;

      if (txRes.status === "fulfilled") {
        setTransactions(Array.isArray(txRes.value.data) ? txRes.value.data : []);
      } else {
        throw txRes.reason;
      }

      const medsData = medsRes.status === "fulfilled" ? (medsRes.value.data?.items || medsRes.value.data || []) : [];
      setMedicines(Array.isArray(medsData) ? medsData : []);

      const batchesData = batchRes.status === "fulfilled" ? (batchRes.value.data?.items || batchRes.value.data || []) : [];
      setBatches(Array.isArray(batchesData) ? batchesData : []);

      if (usersRes && usersRes.status === "fulfilled") {
        const usersData = usersRes.value.data?.items || usersRes.value.data || [];
        setUsers(Array.isArray(usersData) ? usersData : []);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load stock ledger transactions.");
    } finally {
      setLoading(false);
    }
  }, [isUserAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Counts for filter tabs
  const counts = useMemo(() => {
    return {
      all: transactions.length,
      stockIn: transactions.filter((t) => {
        const s = String(t.transactionType || "").toLowerCase().replace(/[\s_-]+/g, "");
        return t.transactionType === 1 || s === "1" || s === "stockin";
      }).length,
      stockOut: transactions.filter((t) => {
        const s = String(t.transactionType || "").toLowerCase().replace(/[\s_-]+/g, "");
        return t.transactionType === 2 || s === "2" || s === "stockout";
      }).length,
      adjustment: transactions.filter((t) => {
        const s = String(t.transactionType || "").toLowerCase().replace(/[\s_-]+/g, "");
        return t.transactionType === 3 || s === "3" || s === "adjustment";
      }).length
    };
  }, [transactions]);

  // Filtered & Sorted Transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let list = [...transactions];

    // Filter by Transaction Type
    if (typeFilter !== "all") {
      const target = String(typeFilter).toLowerCase().replace(/[\s_-]+/g, "");
      list = list.filter((t) => {
        const num = Number(t.transactionType);
        const s = String(t.transactionType || "").toLowerCase().replace(/[\s_-]+/g, "");
        if (target === "1" || target === "stockin") return num === 1 || s === "1" || s === "stockin";
        if (target === "2" || target === "stockout") return num === 2 || s === "2" || s === "stockout";
        if (target === "3" || target === "adjustment") return num === 3 || s === "3" || s === "adjustment";
        if (target === "4" || target === "transfer") return num === 4 || s === "4" || s === "transfer";
        return true;
      });
    }

    // Filter by Medicine
    if (medicineFilter) {
      list = list.filter((t) => String(t.medicineId) === String(medicineFilter));
    }

    // Search Query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => {
        const med = medicines.find((m) => m.id === t.medicineId);
        const medName = (med?.name || "").toLowerCase();
        const medCode = (med?.medicineCode || "").toLowerCase();

        const batch = batches.find((b) => b.id === t.batchId);
        const batchNo = (batch?.batchNumber || "").toLowerCase();

        const reason = (t.reason || "").toLowerCase();
        const idStr = String(t.id);
        const creator = (t.createdByName || t.userFullName || t.createdBy || "").toLowerCase();
        const matchedUser = users.find((u) => String(u.id) === String(t.createdBy));
        const matchedUserName = (matchedUser?.fullName || matchedUser?.userName || "").toLowerCase();

        return (
          medName.includes(q) ||
          medCode.includes(q) ||
          batchNo.includes(q) ||
          reason.includes(q) ||
          idStr.includes(q) ||
          creator.includes(q) ||
          matchedUserName.includes(q)
        );
      });
    }

    // Sorting
    list.sort((a, b) => {
      let valA, valB;

      if (sortBy === "createdAt") {
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
      } else if (sortBy === "medicine") {
        const medA = medicines.find((m) => m.id === a.medicineId)?.name || "";
        const medB = medicines.find((m) => m.id === b.medicineId)?.name || "";
        valA = medA.toLowerCase();
        valB = medB.toLowerCase();
      } else if (sortBy === "type") {
        valA = String(a.transactionType || "").toLowerCase();
        valB = String(b.transactionType || "").toLowerCase();
      } else if (sortBy === "quantity") {
        valA = Number(a.quantity) || 0;
        valB = Number(b.quantity) || 0;
      } else {
        valA = a.id;
        valB = b.id;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [transactions, typeFilter, medicineFilter, search, sortBy, sortDirection, medicines, batches]);

  // Pagination Slice
  const totalCount = filteredAndSortedTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedTransactions, safePage, pageSize]);

  // Handlers
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
    setPage(1);
  };

  const handleMedicineFilterChange = (medId) => {
    setMedicineFilter(medId);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleRecordSubmit = async (dto) => {
    setModalLoading(true);
    setModalError("");
    try {
      await stockTransactionsApi.create(dto);
      setFeedback("Stock movement transaction recorded successfully.");
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setModalError(getErrorMessage(err) || "Failed to record stock movement.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="ledger-page-container">
      {/* 1. Page Header */}
      <div className="ledger-header">
        <div>
          <h1 className="ledger-title">Stock Ledger</h1>
          <p className="ledger-subtitle">
            Audit trail of inventory movements, stock receipts, dispensations, and balance adjustments
          </p>
        </div>
        <div className="ledger-header-actions">
          <button
            type="button"
            className="btn-record-stock"
            onClick={() => {
              setModalError("");
              setIsModalOpen(true);
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Record Stock Movement
          </button>
        </div>
      </div>

      {/* 2. Feedback and Error Alerts */}
      {feedback && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
            padding: "8px 14px",
            borderRadius: "6px",
            fontSize: "13px",
            marginBottom: "16px"
          }}
        >
          {feedback}
        </div>
      )}

      {error && (
        <div className="decent-error-box" style={{ marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* 3. KPI Statistics Cards */}
      <LedgerStatsCards transactions={transactions} />

      {/* 4. Main Ledger Card with Toolbar and Table */}
      <div className="ledger-card">
        <LedgerToolbar
          typeFilter={typeFilter}
          onTypeFilterChange={handleTypeFilterChange}
          medicineFilter={medicineFilter}
          onMedicineFilterChange={handleMedicineFilterChange}
          medicines={medicines}
          search={search}
          onSearchChange={handleSearchChange}
          onOpenRecordModal={() => setIsModalOpen(true)}
          totalCount={totalCount}
          counts={counts}
        />

        <LedgerTable
          transactions={paginatedTransactions}
          medicines={medicines}
          batches={batches}
          users={users}
          loading={loading}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          page={safePage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      </div>

      {/* 5. Record Transaction Modal */}
      <RecordTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRecordSubmit}
        medicines={medicines}
        batches={batches}
        loading={modalLoading}
        error={modalError}
        isAdmin={isUserAdmin}
      />
    </div>
  );
}
