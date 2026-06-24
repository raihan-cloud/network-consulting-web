"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  replyTicket,
  TicketPriority,
  TicketStatus,
  updateTicketStatus,
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

export default function AdminSupportDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reply, setReply] = useState("");

  async function loadTicket() {
    try {
      setLoading(true);

      const ticketRef = doc(db, "tickets", ticketId);
      const ticketSnap = await getDoc(ticketRef);

      if (!ticketSnap.exists()) {
        setTicket(null);
        return;
      }

      const data = {
        id: ticketSnap.id,
        ...ticketSnap.data(),
      } as Ticket;

      setTicket(data);
      setReply(data.adminReply || "");
    } catch (error) {
      console.error("LOAD TICKET DETAIL ERROR:", error);
      alert("Gagal memuat detail ticket.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  const handleStatusChange = async (status: TicketStatus) => {
    try {
      setUpdating(true);

      await updateTicketStatus(ticketId, status);
      await loadTicket();

      alert(`Status ticket berhasil diubah menjadi ${status}.`);
    } catch (error) {
      console.error("UPDATE TICKET STATUS ERROR:", error);
      alert("Gagal mengubah status ticket.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) {
      alert("Balasan admin tidak boleh kosong.");
      return;
    }

    try {
      setUpdating(true);

      await replyTicket(ticketId, reply);
      await loadTicket();

      alert("Balasan berhasil dikirim.");
    } catch (error) {
      console.error("REPLY TICKET ERROR:", error);
      alert("Gagal mengirim balasan.");
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <section className="admin-content">
        <div className="admin-table-card">Loading ticket detail...</div>
      </section>
    );
  }

  if (!ticket) {
    return (
      <section className="admin-content">
        <div className="admin-table-card">Ticket tidak ditemukan.</div>
      </section>
    );
  }

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Ticket Detail</span>
          <h1>{ticket.subject}</h1>
        </div>

        <Link href="/admin/support" className="btn btn-light">
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </Link>
      </div>

      <div className="admin-ticket-detail-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Support Request</span>
              <h2>Ticket Information</h2>
            </div>
          </div>

          <div className="invoice-detail-grid">
            <div>
              <span>Ticket ID</span>
              <strong>#{ticket.id.slice(0, 8)}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{ticket.status}</strong>
            </div>

            <div>
              <span>Client</span>
              <strong>{ticket.clientName}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{ticket.clientEmail}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>{ticket.category}</strong>
            </div>

            <div>
              <span>Priority</span>
              <strong>{ticket.priority}</strong>
            </div>

            <div>
              <span>Created</span>
              <strong>{formatDate(ticket.createdAt)}</strong>
            </div>

            <div>
              <span>Updated</span>
              <strong>{formatDate(ticket.updatedAt)}</strong>
            </div>
          </div>

          <div className="admin-ticket-message">
            <span>Description</span>
            <p>{ticket.description}</p>
          </div>

          {ticket.adminReply && (
            <div className="admin-ticket-message admin-reply-box">
              <span>Admin Reply</span>
              <p>{ticket.adminReply}</p>
            </div>
          )}
        </div>

        <aside className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Actions</span>
              <h2>Manage Ticket</h2>
            </div>
          </div>

          <div className="admin-invoice-actions">
            <select
              className="form-select"
              value={ticket.status}
              disabled={updating}
              onChange={(e) =>
                handleStatusChange(e.target.value as TicketStatus)
              }
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <textarea
              className="form-control"
              rows={6}
              placeholder="Tulis balasan untuk client..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            ></textarea>

            <button
              className="btn btn-warning w-100"
              disabled={updating}
              onClick={handleReply}
            >
              {updating ? "Saving..." : "Send Reply"}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}