"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type ConsultationStatus = "New" | "Contacted" | "Done";

type Consultation = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  status?: ConsultationStatus;
  createdAt?: any;
};

const statusOptions: ConsultationStatus[] = ["New", "Contacted", "Done"];

function formatDate(value: any) {
  if (!value) return "-";

  const date = value?.toDate ? value.toDate() : new Date(value);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizePhone(phone?: string) {
  if (!phone) return "";

  const cleaned = phone.replace(/[^\d]/g, "");

  if (cleaned.startsWith("0")) return `62${cleaned.slice(1)}`;
  if (cleaned.startsWith("62")) return cleaned;

  return cleaned;
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ConsultationStatus>(
    "All"
  );

  const fetchConsultations = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, "consultations"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Consultation[];

      setConsultations(data);
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ConsultationStatus) => {
    setUpdatingId(id);

    try {
      await updateDoc(doc(db, "consultations", id), { status });

      setConsultations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (error) {
      console.error("Failed to update consultation:", error);
    } finally {
      setUpdatingId("");
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const stats = useMemo(() => {
    return {
      total: consultations.length,
      new: consultations.filter((item) => (item.status || "New") === "New")
        .length,
      contacted: consultations.filter((item) => item.status === "Contacted")
        .length,
      done: consultations.filter((item) => item.status === "Done").length,
    };
  }, [consultations]);

  const filteredConsultations = consultations.filter((item) => {
    const keyword = search.toLowerCase();
    const itemStatus = item.status || "New";

    const matchesSearch =
      item.name?.toLowerCase().includes(keyword) ||
      item.email?.toLowerCase().includes(keyword) ||
      item.phone?.toLowerCase().includes(keyword) ||
      item.company?.toLowerCase().includes(keyword) ||
      item.service?.toLowerCase().includes(keyword) ||
      item.message?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "All" ? true : itemStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="admin-main consultation-admin-page">
      <div className="consultation-hero">
        <div>
          <span className="admin-eyebrow">CLIENT CONSULTATION</span>
          <h1>Consultations</h1>
          <p>
            Pantau dan kelola permintaan konsultasi jaringan dari calon client
            NetPro secara lebih cepat dan terstruktur.
          </p>
        </div>

        <button onClick={fetchConsultations} className="consultation-refresh">
          <i className="bi bi-arrow-clockwise"></i>
          Refresh
        </button>
      </div>

      <section className="consultation-stat-grid">
        <div className="consultation-stat-card">
          <span>Total Request</span>
          <strong>{stats.total}</strong>
          <small>Semua konsultasi masuk</small>
        </div>

        <div className="consultation-stat-card accent-new">
          <span>New</span>
          <strong>{stats.new}</strong>
          <small>Belum ditindaklanjuti</small>
        </div>

        <div className="consultation-stat-card accent-contacted">
          <span>Contacted</span>
          <strong>{stats.contacted}</strong>
          <small>Sudah dihubungi</small>
        </div>

        <div className="consultation-stat-card accent-done">
          <span>Done</span>
          <strong>{stats.done}</strong>
          <small>Selesai diproses</small>
        </div>
      </section>

      <section className="consultation-control-card">
        <div className="consultation-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Cari nama, email, nomor, layanan, atau pesan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="consultation-filter-tabs">
          {["All", ...statusOptions].map((status) => (
            <button
              key={status}
              onClick={() =>
                setStatusFilter(status as "All" | ConsultationStatus)
              }
              className={statusFilter === status ? "active" : ""}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      <section className="consultation-list">
        {loading ? (
          <div className="consultation-empty-state">
            <i className="bi bi-hourglass-split"></i>
            <h3>Memuat konsultasi...</h3>
            <p>Sedang mengambil data terbaru dari Firestore.</p>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="consultation-empty-state">
            <i className="bi bi-chat-left-text"></i>
            <h3>Belum ada konsultasi</h3>
            <p>Data konsultasi client akan muncul di halaman ini.</p>
          </div>
        ) : (
          filteredConsultations.map((item) => {
            const status = item.status || "New";
            const whatsappNumber = normalizePhone(item.phone);

            return (
              <article key={item.id} className="consultation-modern-card">
                <div className="consultation-card-top">
                  <div className="consultation-avatar">
                    {(item.name || "C").charAt(0).toUpperCase()}
                  </div>

                  <div className="consultation-client">
                    <div className="consultation-client-row">
                      <h3>{item.name || "Unnamed Client"}</h3>
                      <span
                        className={`consultation-status-pill status-${status.toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </div>

                    <p>
                      {item.company || "Individual Client"} •{" "}
                      {item.service || "General Consultation"}
                    </p>
                  </div>
                </div>

                <p className="consultation-modern-message">
                  {item.message || "Tidak ada pesan konsultasi."}
                </p>

                <div className="consultation-meta-grid">
                  <a href={`mailto:${item.email || ""}`}>
                    <i className="bi bi-envelope"></i>
                    <span>{item.email || "-"}</span>
                  </a>

                  <a href={`tel:${item.phone || ""}`}>
                    <i className="bi bi-telephone"></i>
                    <span>{item.phone || "-"}</span>
                  </a>

                  <div>
                    <i className="bi bi-calendar3"></i>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                <div className="consultation-card-footer">
                  <div className="consultation-status-select">
                    <span>Status</span>
                    <select
                      value={status}
                      disabled={updatingId === item.id}
                      onChange={(e) =>
                        updateStatus(item.id, e.target.value as ConsultationStatus)
                      }
                    >
                      {statusOptions.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="consultation-action-buttons">
                    <a
                      href={
                        whatsappNumber
                          ? `https://wa.me/${whatsappNumber}`
                          : "#"
                      }
                      target="_blank"
                      className="consultation-wa-btn"
                    >
                      <i className="bi bi-whatsapp"></i>
                      WhatsApp
                    </a>

                    <a
                      href={`mailto:${item.email || ""}`}
                      className="consultation-email-btn"
                    >
                      <i className="bi bi-envelope-paper"></i>
                      Email
                    </a>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}