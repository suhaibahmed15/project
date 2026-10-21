import { useState, useEffect } from "react";
import { usersApi, rolesApi, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import UnauthorizedPage from "./UnauthorizedPage";
import "../styles/users.css";

// Modular Reusable Components
import UserListCard from "../components/users/UserListCard";
import RolesListCard from "../components/users/RolesListCard";
import AddUserModal from "../components/users/AddUserModal";
import ConfirmModal from "../components/common/ConfirmModal";

export default function UsersPage() {
  const { isAdmin, roleId } = useAuth();
  const isUserAdmin = Boolean(isAdmin || roleId === 1 || roleId === "1");

  const [activeTab, setActiveTab] = useState("users"); // "users" or "roles"
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 1. Fetch Users and Roles from API (Admin Only)
  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, rolesRes] = await Promise.all([
        usersApi.getAll(),
        rolesApi.getAll()
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err) || "Failed to load users or roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserAdmin) {
      loadData();
    }
  }, [isUserAdmin]);

  // If user is not an Admin, render the Unauthorized Page
  if (!isUserAdmin) {
    return <UnauthorizedPage />;
  }

  // 2. Assign Role to User
  const handleAssignRole = async (userId, newRoleId) => {
    setError("");
    setSuccess("");
    try {
      await usersApi.assignRole(userId, { roleId: Number(newRoleId) });
      setSuccess("Role assigned successfully!");
      loadData();
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to assign role.");
    }
  };

  // 3. Delete User Handlers (Modal Card)
  const handleDeleteUser = (userOrId, maybeName) => {
    if (typeof userOrId === "object" && userOrId !== null) {
      setUserToDelete(userOrId);
    } else {
      const found = users.find((u) => u.id === userOrId);
      setUserToDelete(found || { id: userOrId, fullName: maybeName });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    setError("");
    setSuccess("");
    try {
      await usersApi.delete(userToDelete.id);
      const name = userToDelete.fullName || userToDelete.email || "User";
      setSuccess(`User "${name}" deleted successfully.`);
      setUserToDelete(null);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="users-page-container">
      {/* Header */}
      <div className="users-header">
        <div>
          <h1 className="users-title">User &amp; Role Management</h1>
          <p className="users-subtitle">
            Manage system access, create users, assign roles, and view system permissions
          </p>
        </div>

        {/* Tab switchers */}
        <div className="users-tab-buttons">
          <button
            type="button"
            className={`btn ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => { setActiveTab("users"); setError(""); setSuccess(""); }}
          >
            Users 
          </button>
          <button
            type="button"
            className={`btn ${activeTab === "roles" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => { setActiveTab("roles"); setError(""); setSuccess(""); }}
          >
            Roles 
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="users-alert error">
          <span>⚠️ {error}</span>
          <button type="button" className="users-alert-close" onClick={() => setError("")}>&times;</button>
        </div>
      )}
      {success && (
        <div className="users-alert success">
          <span>✅ {success}</span>
          <button type="button" className="users-alert-close" onClick={() => setSuccess("")}>&times;</button>
        </div>
      )}

      {/* TAB 1: Users Card */}
      {activeTab === "users" && (
        <UserListCard
          users={users}
          roles={roles}
          loading={loading}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onAssignRole={handleAssignRole}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* TAB 2: Roles Card */}
      {activeTab === "roles" && (
        <RolesListCard
          roles={roles}
          loading={loading}
        />
      )}

      {/* Modal: Add New User */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(msg) => { setSuccess(msg); loadData(); }}
        onError={(msg) => setError(msg)}
        roles={roles}
      />

      {/* Delete User Confirmation Modal Card */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.fullName || userToDelete?.email}"?`}
        note="This will permanently revoke the user's access to the system."
        confirmLabel="Delete User"
        onConfirm={handleDeleteConfirm}
        onClose={() => setUserToDelete(null)}
        loading={deleting}
        danger={true}
      />
    </div>
  );
}
