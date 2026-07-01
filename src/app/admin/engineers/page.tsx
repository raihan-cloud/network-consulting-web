"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Engineer = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  specialization: string;
  status: "active" | "inactive";
  createdAt?: any;
};

const initialForm = {
  name: "",
  role: "Network Engineer",
  phone: "",
  email: "",
  specialization: "",
  status: "active" as "active" | "inactive",
};

export default function AdminEngineersPage() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadEngineers() {
    try {
      setLoading(true);

      const q = query(collection(db, "engineers"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Engineer[];

      setEngineers(data);
    } catch (error) {
      console.error("LOAD ENGINEERS ERROR:", error);
      alert("Gagal mengambil data engineer.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEngineers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.specialization) {
      alert("Nama, nomor WhatsApp, dan spesialisasi wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateDoc(doc(db, "engineers", editingId), {
          ...form,
          updatedAt: serverTimestamp(),
        });

        alert("Engineer berhasil diperbarui.");
      } else {
        await addDoc(collection(db, "engineers"), {
          ...form,
          totalProjects: 0,
          completedProjects: 0,
          rating: 5,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        alert("Engineer berhasil ditambahkan.");
      }

      resetForm();
      await loadEngineers();
    } catch (error) {
      console.error("SAVE ENGINEER ERROR:", error);
      alert("Gagal menyimpan engineer.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (engineer: Engineer) => {
    setEditingId(engineer.id);
    setForm({
      name: engineer.name || "",
      role: engineer.role || "Network Engineer",
      phone: engineer.phone || "",
      email: engineer.email || "",
      specialization: engineer.specialization || "",
      status: engineer.status || "active",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus engineer ini?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "engineers", id));
      await loadEngineers();
      alert("Engineer berhasil dihapus.");
    } catch (error) {
      console.error("DELETE ENGINEER ERROR:", error);
      alert("Gagal menghapus engineer.");
    }
  };

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Engineers</span>
          <h1>Engineer Management</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadEngineers}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="engineer-admin-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>{editingId ? "Edit Engineer" : "Add Engineer"}</span>
              <h2>{editingId ? "Update Engineer" : "New Engineer"}</h2>
            </div>
          </div>

          <div className="engineer-form">
            <label>
              Nama Engineer
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Raihan Muzaffar"
              />
            </label>

            <label>
              Role
              <select name="role" value={form.role} onChange={handleChange}>
                <option>Network Engineer</option>
                <option>Fiber Optic Engineer</option>
                <option>CCTV Engineer</option>
                <option>Server Engineer</option>
                <option>Cloud Engineer</option>
                <option>IT Support</option>
              </select>
            </label>

            <label>
              Nomor WhatsApp
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0812xxxxxxx"
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="engineer@netpro.id"
              />
            </label>

            <label>
              Spesialisasi
              <input
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="MikroTik, VLAN, Fiber Optic, CCTV"
              />
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            <div className="engineer-form-actions">
              <button
                className="btn btn-warning"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Engineer"
                  : "Add Engineer"}
              </button>

              {editingId && (
                <button className="btn btn-light" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Engineer Directory</span>
              <h2>Team Members</h2>
            </div>
          </div>

          <div className="engineer-list">
            {loading ? (
              <div className="admin-table-card">Loading engineers...</div>
            ) : engineers.length === 0 ? (
              <div className="engineer-empty">
                <i className="bi bi-person-workspace"></i>
                <h3>Belum ada engineer</h3>
                <p>Tambahkan engineer untuk ditugaskan ke project.</p>
              </div>
            ) : (
              engineers.map((engineer) => (
                <article className="engineer-card" key={engineer.id}>
                  <div className="engineer-avatar">
                    {engineer.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="engineer-card-body">
                    <div className="engineer-card-top">
                      <div>
                        <h3>{engineer.name}</h3>
                        <p>{engineer.role}</p>
                      </div>

                      <span className={`engineer-status ${engineer.status}`}>
                        {engineer.status}
                      </span>
                    </div>

                    <div className="engineer-meta">
                      <span>
                        <i className="bi bi-telephone"></i>
                        {engineer.phone}
                      </span>

                      <span>
                        <i className="bi bi-envelope"></i>
                        {engineer.email || "-"}
                      </span>

                      <span>
                        <i className="bi bi-tools"></i>
                        {engineer.specialization}
                      </span>
                    </div>

                    <div className="engineer-actions">
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => handleEdit(engineer)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(engineer.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}