import { useState, useEffect, useMemo, useCallback } from "react";
import { alertsApi, medicinesApi, batchesApi, getErrorMessage } from "../api/client";
import AlertStatsCards from "../components/alerts/AlertStatsCards";
import CreateAlertModal from "../components/alerts/CreateAlertModal";
import Pagination from "../components/common/Pagination";
import "../styles/alerts.css";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState("all"); // 'all' | 'unread' | 'active' | 'resolved' | 'lowstock' | 'nearexpiry' | 'expired'
  const [medicineFilter, setMedicineFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Load Alerts and Medicines
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [alertsRes, medsRes, batchRes] = await Promise.all([
        alertsApi.getAll(),
        medicinesApi.getAll({ pageSize: 300 }),
        batchesApi.getAll({ pageSize: 300 })
      ]);

      const alertsList = Array.isArray(alertsRes.data) ? alertsRes.data : [];
      const medsList = medsRes.data?.items || (Array.isArray(medsRes.data) ? medsRes.data : []);
      const batchList = batchRes.data?.items || (Array.isArray(batchRes.data) ? batchRes.data : []);

      setAlerts(alertsList);
      setMedicines(medsList);
      setBatches(batchList);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err) || "Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Temporary feedback toast
  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 4000);
  };

  // Medicine lookup map
  const medicinesMap = useMemo(() => {
    const map = {};
    medicines.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [medicines]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: alerts.length,
      unread: alerts.filter((a) => !a.isRead).length,
      active: alerts.filter((a) => !a.isResolved).length,
      resolved: alerts.filter((a) => a.isResolved).length,
      lowstock: alerts.filter(
        (a) => a.alertType === 1 || String(a.alertType).toLowerCase() === "lowstock"
      ).length,
      nearexpiry: alerts.filter(
        (a) => a.alertType === 2 || String(a.alertType).toLowerCase().includes("near")
      ).length,
      expired: alerts.filter(
        (a) => a.alertType === 3 || String(a.alertType).toLowerCase().includes("expired")
      ).length
    };
  }, [alerts]);

  // Mark single alert as Read
  const handleMarkAsRead = async (id) => {
    try {
      await alertsApi.markAsRead(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
      );
      showFeedback("Alert marked as read.");
      window.dispatchEvent(new Event("alerts-updated"));
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to mark alert as read.");
    }
  };

  // Resolve single alert
  const handleResolve = async (id) => {
    try {
      await alertsApi.resolve(id);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, isResolved: true, isRead: true, resolvedAt: new Date().toISOString() }
            : a
        )
      );
      showFeedback("Alert marked as resolved.");
      window.dispatchEvent(new Event("alerts-updated"));
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to resolve alert.");
    }
  };

  // Bulk mark all unread alerts as read
  const handleMarkAllAsRead = async () => {
    const unreadAlerts = alerts.filter((a) => !a.isRead);
    if (unreadAlerts.length === 0) {
      showFeedback("All alerts are already read.");
      return;
    }

    try {
      await Promise.all(unreadAlerts.map((a) => alertsApi.markAsRead(a.id)));
      setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
      showFeedback(`Successfully marked ${unreadAlerts.length} alerts as read.`);
      window.dispatchEvent(new Event("alerts-updated"));
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to mark all alerts as read.");
    }
  };

  // Create manual alert
  const handleCreateAlert = async (formData) => {
    setModalLoading(true);
    try {
      await alertsApi.create(formData);
      setIsModalOpen(false);
      showFeedback("New alert created successfully.");
      window.dispatchEvent(new Event("alerts-updated"));
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to create alert.");
    } finally {
      setModalLoading(false);
    }
  };

  // Filtered and Sorted Alerts
  const filteredAlerts = useMemo(() => {
    let list = [...alerts];

    // Filter by Tab
    if (tabFilter === "unread") {
      list = list.filter((a) => !a.isRead);
    } else if (tabFilter === "active") {
      list = list.filter((a) => !a.isResolved);
    } else if (tabFilter === "resolved") {
      list = list.filter((a) => a.isResolved);
    } else if (tabFilter === "lowstock") {
      list = list.filter(
        (a) => a.alertType === 1 || String(a.alertType).toLowerCase() === "lowstock"
      );
    } else if (tabFilter === "nearexpiry") {
      list = list.filter(
        (a) => a.alertType === 2 || String(a.alertType).toLowerCase().includes("near")
      );
    } else if (tabFilter === "expired") {
      list = list.filter(
        (a) => a.alertType === 3 || String(a.alertType).toLowerCase().includes("expired")
      );
    }

    // Filter by Medicine
    if (medicineFilter) {
      list = list.filter((a) => String(a.medicineId) === String(medicineFilter));
    }

    // Text Search (medicine name, message, batch number)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((a) => {
        const medName =
          a.medicineName || medicinesMap[a.medicineId]?.name || "";
        const batchNum = a.batchNumber || "";
        const msg = a.message || "";
        return (
          medName.toLowerCase().includes(q) ||
          batchNum.toLowerCase().includes(q) ||
          msg.toLowerCase().includes(q)
        );
      });
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortBy] ?? "";
      let valB = b[sortBy] ?? "";

      if (sortBy === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [alerts, tabFilter, medicineFilter, search, sortBy, sortDirection, medicinesMap]);

  // Paginated Slice
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / pageSize));
  const paginatedAlerts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAlerts.slice(start, start + pageSize);
  }, [filteredAlerts, page, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, tabFilter, medicineFilter, pageSize]);

  // Render Alert Type Badge & Icon
  const renderTypeDetails = (type) => {
    const num = Number(type);
    const str = String(type).toLowerCase();

    if (num === 1 || str === "lowstock") {
      return {
        badgeClass: "low-stock",
        label: "Low Stock",
        iconClass: "low-stock",
        icon: "⚠️"
      };
    }
    if (num === 2 || str.includes("near")) {
      return {
        badgeClass: "near-expiry",
        label: "Near Expiry",
        iconClass: "near-expiry",
        icon: "⏳"
      };
    }
    if (num === 3 || str.includes("expired")) {
      return {
        badgeClass: "expired",
        label: "Expired",
        iconClass: "expired",
        icon: "🚫"
      };
    }
    return {
      badgeClass: "stock-out",
      label: "Stock Out",
      iconClass: "stock-out",
      icon: "📦"
    };
  };

  return (
    <div className="alerts-page-container">
      {/* 1. Header with Title & Action Buttons */}
      <div className="alerts-header">
        <div>
          <h1 className="alerts-title">Alerts &amp; Notifications</h1>
          <p className="alerts-subtitle">
            Live warnings for low stock levels, expiring medicines, and inventory stockouts
          </p>
        </div>

        <div className="alerts-header-actions">
          <button
            type="button"
            className="btn-outline-action"
            onClick={handleMarkAllAsRead}
            disabled={tabCounts.unread === 0 || loading}
          >
            Mark All Read
          </button>
          <button
            type="button"
            className="btn-outline-action"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            type="button"
            className="btn-create-alert"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Alert
          </button>
        </div>
      </div>

      {/* Feedback & Error Banners */}
      {feedback && (
        <div className="alerts-feedback-banner success">{feedback}</div>
      )}
      {error && (
        <div className="alerts-feedback-banner error">{error}</div>
      )}

      {/* 2. KPI Summary Cards */}
      <AlertStatsCards alerts={alerts} />

      {/* 3. Controls Card (Filter Chips + Search & Dropdowns) */}
      <div className="alerts-controls-card">
        {/* Filter Chips */}
        <div className="alerts-chips-row">
          <button
            type="button"
            className={`alerts-chip-btn ${tabFilter === "all" ? "active" : ""}`}
            onClick={() => setTabFilter("all")}
          >
            All Alerts
            <span className="alerts-chip-count">{tabCounts.all}</span>
          </button>

          <button
            type="button"
            className={`alerts-chip-btn ${tabFilter === "unread" ? "active" : ""}`}
            onClick={() => setTabFilter("unread")}
          >
            Unread
            <span className="alerts-chip-count">{tabCounts.unread}</span>
          </button>

          <button
            type="button"
            className={`alerts-chip-btn ${tabFilter === "active" ? "active" : ""}`}
            onClick={() => setTabFilter("active")}
          >
            Active (Unresolved)
            <span className="alerts-chip-count">{tabCounts.active}</span>
          </button>

          <button
            type="button"
            className={`alerts-chip-btn ${tabFilter === "resolved" ? "active" : ""}`}
            onClick={() => setTabFilter("resolved")}
          >
            Resolved
            <span className="alerts-chip-count">{tabCounts.resolved}</span>
          </button>

          <button
            type="button"
            className={`alerts-chip-btn ${tabFilter === "lowstock" ? "active" : ""}`}
            onClick={() => setTabFilter("lowstock")}
          >
            Low Stock
            <span className="alerts-chip-count">{tabCounts.lowstock}</span>
          </button>

          <button
            type="button"
            className={`alerts-chip-btn ${tabFilter === "nearexpiry" ? "active" : ""}`}
            onClick={() => setTabFilter("nearexpiry")}
          >
            Near Expiry
            <span className="alerts-chip-count">{tabCounts.nearexpiry}</span>
          </button>

          <button
            type="button"
            className={`alerts-chip-btn ${tabFilter === "expired" ? "active" : ""}`}
            onClick={() => setTabFilter("expired")}
          >
            Expired
            <span className="alerts-chip-count">{tabCounts.expired}</span>
          </button>
        </div>

        {/* Search & Medicine Dropdown */}
        <div className="alerts-filter-bar">
          <input
            type="text"
            className="alerts-search-input"
            placeholder="Search by medicine, batch, or alert message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="alerts-select"
            value={medicineFilter}
            onChange={(e) => setMedicineFilter(e.target.value)}
          >
            <option value="">All Medicines</option>
            {medicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {(search || medicineFilter || tabFilter !== "all") && (
            <button
              type="button"
              className="btn-outline-action"
              style={{ fontSize: "12px", padding: "6px 12px" }}
              onClick={() => {
                setSearch("");
                setMedicineFilter("");
                setTabFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Alert List Card */}
      <div className="alerts-list-card">
        <div className="alerts-list-header">
          <span>Showing {filteredAlerts.length} alert{filteredAlerts.length === 1 ? "" : "s"}</span>
          <span>Status &amp; Actions</span>
        </div>

        {loading ? (
          <div className="alerts-empty-state">
            <span className="spinner-border" />
            <p>Loading pharmacy alerts...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="alerts-empty-state">
            <div className="alerts-empty-icon">🔔</div>
            <h3 className="alerts-empty-title">No Alerts Found</h3>
            <p className="alerts-empty-desc">
              {search || medicineFilter || tabFilter !== "all"
                ? "No alerts match the selected criteria. Try adjusting or clearing your filters."
                : "Great news! There are currently no active alerts for your inventory."}
            </p>
          </div>
        ) : (
          <div>
            {paginatedAlerts.map((alert) => {
              const details = renderTypeDetails(alert.alertType);
              const med =
                alert.medicineName ||
                medicinesMap[alert.medicineId]?.name ||
                `Medicine #${alert.medicineId}`;
              const formattedDate = new Date(alert.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={alert.id}
                  className={`alert-item-row ${!alert.isRead ? "unread" : ""}`}
                >
                  <div className="alert-item-left">
                    <div className={`alert-type-icon-wrapper ${details.iconClass}`}>
                      {details.icon}
                    </div>

                    <div className="alert-content">
                      <div className="alert-top-meta">
                        <span className={`alert-badge ${details.badgeClass}`}>
                          {details.label}
                        </span>

                        {!alert.isRead && (
                          <span className="alert-pill-read unread">New / Unread</span>
                        )}

                        {alert.isResolved && (
                          <span className="alert-pill-read resolved">Resolved</span>
                        )}

                        <span className="alert-medicine-name">{med}</span>

                        {alert.batchNumber && (
                          <span className="alert-batch-tag">
                            Batch: {alert.batchNumber}
                          </span>
                        )}
                      </div>

                      <p className="alert-message-text">{alert.message}</p>

                      <div className="alert-timestamp">
                        <span>Logged: {formattedDate}</span>
                        {alert.isResolved && alert.resolvedAt && (
                          <span>
                            • Resolved on:{" "}
                            {new Date(alert.resolvedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="alert-item-actions">
                    {!alert.isRead && (
                      <button
                        type="button"
                        className="btn-action-read"
                        onClick={() => handleMarkAsRead(alert.id)}
                        title="Mark alert as read"
                      >
                        Mark Read
                      </button>
                    )}

                    {!alert.isResolved ? (
                      <button
                        type="button"
                        className="btn-action-resolve"
                        onClick={() => handleResolve(alert.id)}
                        title="Mark alert as resolved"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Resolve
                      </button>
                    ) : (
                      <span className="btn-resolved-done">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Pagination */}
      {filteredAlerts.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={filteredAlerts.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          loading={loading}
        />
      )}

      {/* 6. Create Alert Modal */}
      <CreateAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medicines={medicines}
        batches={batches}
        onSubmit={handleCreateAlert}
        loading={modalLoading}
      />
    </div>
  );
}