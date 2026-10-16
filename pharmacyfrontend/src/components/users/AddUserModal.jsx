import { useState } from "react";
import { usersApi, getErrorMessage } from "../../api/client";
import "../../styles/users.css";

export default function AddUserModal({ isOpen, onClose, onSuccess, onError, roles }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    roleId: roles[0]?.id || ""
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim() || !form.roleId) {
      onError("Please fill in all required fields (Name, Email, Password, and Role).");
      return;
    }

    setSubmitting(true);
    onError("");

    try {
      await usersApi.create({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber ? form.phoneNumber.trim() : null,
        roleId: Number(form.roleId)
      });

      onSuccess("User created successfully!");
      setForm({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        roleId: roles[0]?.id || ""
      });
      onClose();
    } catch (err) {
      onError(getErrorMessage(err) || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="users-modal-backdrop" onClick={onClose}>
      <div className="users-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="users-modal-header">
          <h3>Create New User</h3>
          <button type="button" className="users-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="users-modal-form">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. John Doe"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. john@pharmacy.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password * (min 6 characters)</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="tel"
              className="form-control"
              placeholder="e.g. +1 555-0199"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assign Role *</label>
            <select
              className="form-control"
              value={form.roleId}
              onChange={(e) => setForm({ ...form, roleId: e.target.value })}
              required
            >
              <option value="" disabled>Select a role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="users-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
