import "../../styles/users.css";

export default function UserListCard({
  users,
  roles,
  loading,
  onOpenAddModal,
  onAssignRole,
  onDeleteUser
}) {
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unassigned";
  };

  return (
    <div className="users-content-card">
      {/* Card Header */}
      <div className="users-card-header">
        <h3>All Registered Users</h3>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenAddModal}
        >
          + Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Assigned Role</th>
              <th>Change Role</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  No users found. Click &quot;+ Add New User&quot; to create one.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.phoneNumber || "—"}</td>
                  <td>
                    <span className="role-pill">
                      {getRoleName(u.roleId)}
                    </span>
                  </td>
                  <td>
                    <select
                      className="role-select"
                      value={u.roleId || ""}
                      onChange={(e) => onAssignRole(u.id, e.target.value)}
                    >
                      <option value="" disabled>Select Role</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="btn-danger-outline"
                      onClick={() => onDeleteUser(u)}
                      title={`Delete user ${u.fullName || u.email || ""}`}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
