"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  updateUserRole,
  UserRole,
} from "@/lib/userService";

type UserAccount = {
  id: string;
  uid?: string;
  name: string;
  email: string;
  whatsapp?: string;
  role: UserRole;
  createdAt?: any;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as UserAccount[];

      setUsers(data);
    } catch (error) {
      console.error("LOAD USERS ERROR:", error);
      alert("Gagal memuat data user.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (
    userId: string,
    role: UserRole
  ) => {
    try {
      setUpdatingId(userId);

      await updateUserRole(userId, role);
      await loadUsers();

      alert(`Role user berhasil diubah menjadi ${role}.`);
    } catch (error) {
      console.error("UPDATE USER ROLE ERROR:", error);
      alert("Gagal mengubah role user.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "-";

    return new Date(timestamp.seconds * 1000).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const clientCount = users.filter((user) => user.role === "client").length;
  const adminCount = users.filter((user) => user.role === "admin").length;

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Users</span>
          <h1>User Management</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadUsers}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="admin-support-stats">
        <div>
          <span>Total Users</span>
          <strong>{users.length}</strong>
          <small>Registered accounts</small>
        </div>

        <div>
          <span>Clients</span>
          <strong>{clientCount}</strong>
          <small>Client portal users</small>
        </div>

        <div>
          <span>Admins</span>
          <strong>{adminCount}</strong>
          <small>Operations users</small>
        </div>

        <div>
          <span>Status</span>
          <strong>Active</strong>
          <small>Auth connected</small>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Role</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6}>Belum ada user.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>#{user.id.slice(0, 8)}</strong>
                    </td>

                    <td>{user.name || "-"}</td>

                    <td>{user.email || "-"}</td>

                    <td>{user.whatsapp || "-"}</td>

                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={user.role}
                        disabled={updatingId === user.id}
                        onChange={(e) =>
                          handleRoleChange(
                            user.id,
                            e.target.value as UserRole
                          )
                        }
                      >
                        <option value="client">client</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>

                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}