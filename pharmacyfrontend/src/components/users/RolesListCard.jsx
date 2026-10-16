import "../../styles/users.css";

export default function RolesListCard({ roles, loading }) {
  return (
    <div className="users-content-card">
      {/* Card Header */}
      <div className="users-card-header">
        <h3>System Roles</h3>
      </div>

      {/* Roles Table */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>ID</th>
              <th>Role Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  Loading roles...
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  No roles found.
                </td>
              </tr>
            ) : (
              roles.map((r) => {
                const isSystemRole = ["admin", "storemanager", "pharmacist"].includes(r.name.toLowerCase());
                return (
                  <tr key={r.id}>
                    <td style={{ color: "#64748b" }}>#{r.id}</td>
                    <td>
                      <span className="role-pill">
                        {r.name}
                      </span>
                    </td>
                    <td>
                      <span className={isSystemRole ? "system-role-tag" : "role-pill"}>
                        {isSystemRole ? "System Role" : "Custom Role"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
