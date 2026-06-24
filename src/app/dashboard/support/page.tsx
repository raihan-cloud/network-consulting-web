"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  createTicket,
  TicketPriority,
  TicketStatus,
} from "@/lib/ticketService";

type Ticket = {
  id: string;
  userId?: string | null;
  clientName: string;
  clientEmail: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  description: string;
  status: TicketStatus;
  adminReply?: string;
  createdAt?: any;
  updatedAt?: any;
};

export default function DashboardSupportPage() {
  const { user, profile } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    category: "",
    priority: "" as TicketPriority | "",
    description: "",
  });

  async function loadTickets() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "tickets"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Ticket[];

      setTickets(data);
    } catch (error) {
      console.error("LOAD CLIENT TICKETS ERROR:", error);
      alert("Gagal mengambil data ticket.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user || !profile) {
      alert("Anda harus login terlebih dahulu.");
      return;
    }

    if (
      !form.subject ||
      !form.category ||
      !form.priority ||
      !form.description
    ) {
      alert("Semua field ticket wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);

      await createTicket({
        userId: user.uid,
        clientName: profile.name,
        clientEmail: profile.email,
        subject: form.subject,
        category: form.category,
        priority: form.priority,
        description: form.description,
      });

      setForm({
        subject: "",
        category: "",
        priority: "",
        description: "",
      });

      await loadTickets();

      alert("Ticket berhasil dibuat.");
    } catch (error) {
      console.error("CREATE TICKET ERROR:", error);
      alert("Gagal membuat ticket.");
    } finally {
      setSubmitting(false);
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

  return (
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Support</span>
          <h1>Support Tickets</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadTickets}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="support-layout">
        <div className="support-ticket-panel">
          <div className="client-panel-header">
            <div>
              <span>Create Ticket</span>
              <h2>Laporkan kendala atau request bantuan</h2>
            </div>
          </div>

          <form className="support-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input
                name="subject"
                className="form-control"
                placeholder="Contoh: WiFi lantai 2 tidak stabil"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Pilih kategori
                  </option>
                  <option>Network Issue</option>
                  <option>Internet Connection</option>
                  <option>VPN Access</option>
                  <option>CCTV</option>
                  <option>Server</option>
                  <option>Documentation</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  className="form-select"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Pilih prioritas
                  </option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows={5}
                placeholder="Jelaskan masalah atau kebutuhan support secara detail..."
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-warning mt-4"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        <div className="support-help-panel">
          <h3>Support Guidelines</h3>

          <div className="support-help-item">
            <i className="bi bi-lightning-charge"></i>
            <div>
              <strong>Urgent Issue</strong>
              <p>Gunakan prioritas urgent untuk jaringan mati total.</p>
            </div>
          </div>

          <div className="support-help-item">
            <i className="bi bi-clock-history"></i>
            <div>
              <strong>Response Time</strong>
              <p>Estimasi respon normal 1 x 24 jam kerja.</p>
            </div>
          </div>

          <div className="support-help-item">
            <i className="bi bi-paperclip"></i>
            <div>
              <strong>Attach Evidence</strong>
              <p>Nanti bisa ditambah upload screenshot/log error.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="support-history-section">
        <div className="client-panel-header">
          <div>
            <span>Ticket History</span>
            <h2>Riwayat support</h2>
          </div>
        </div>

        {loading ? (
          <div className="client-empty-state">
            <h3>Loading tickets...</h3>
          </div>
        ) : tickets.length === 0 ? (
          <div className="client-empty-state">
            <i className="bi bi-headset"></i>
            <h3>Belum ada ticket</h3>
            <p>Ticket support yang Anda buat akan muncul di sini.</p>
          </div>
        ) : (
          <div className="support-ticket-list">
            {tickets.map((ticket) => (
              <article className="support-ticket-card" key={ticket.id}>
                <div>
                  <small>#{ticket.id.slice(0, 8)}</small>
                  <h3>{ticket.subject}</h3>
                  <p>{ticket.category}</p>

                  {ticket.adminReply && (
                    <p className="support-admin-reply">
                      <strong>Admin Reply:</strong> {ticket.adminReply}
                    </p>
                  )}
                </div>

                <div className="support-ticket-meta">
                  <span className={`support-priority ${ticket.priority}`}>
                    {ticket.priority}
                  </span>

                  <span className={`support-status ${ticket.status}`}>
                    {ticket.status}
                  </span>

                  <strong>
                    {formatDate(ticket.updatedAt || ticket.createdAt)}
                  </strong>

                  <Link
                    href={`/dashboard/support/${ticket.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Detail
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}