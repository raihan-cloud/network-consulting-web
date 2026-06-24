"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type {
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

export default function DashboardSupportDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTicketDetail() {
    if (!user) {
      setLoading(false);
      return;
    }

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

      if (data.userId !== user.uid) {
        alert("Anda tidak memiliki akses ke ticket ini.");
        setTicket(null);
        return;
      }

      setTicket(data);
    } catch (error) {
      console.error("LOAD CLIENT TICKET DETAIL ERROR:", error);
      alert("Gagal memuat detail ticket.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ticketId && user) {
      loadTicketDetail();
    }
  }, [ticketId, user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "-";

    return new Date(timestamp.seconds * 1000).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="client-dashboard-content">
        <div className="client-empty-state">
          <h3>Loading ticket detail...</h3>
        </div>
      </section>
    );
  }

  if (!ticket) {
    return (
      <section className="client-dashboard-content">
        <div className="client-empty-state">
          <i className="bi bi-headset"></i>
          <h3>Ticket tidak ditemukan</h3>
          <p>Ticket tidak tersedia atau bukan milik akun Anda.</p>

          <Link href="/dashboard/support" className="btn btn-warning">
            Kembali ke Support
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Ticket Detail</span>
          <h1>{ticket.subject}</h1>
        </div>

        <Link href="/dashboard/support" className="btn btn-light">
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </Link>
      </div>

      <div className="client-ticket-detail-grid">
        <div className="client-panel">
          <div className="client-panel-header">
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

          <div className="client-ticket-message">
            <span>Description</span>
            <p>{ticket.description}</p>
          </div>
        </div>

        <aside className="client-panel">
          <div className="client-panel-header">
            <div>
              <span>Admin Response</span>
              <h2>Reply</h2>
            </div>
          </div>

          {ticket.adminReply ? (
            <div className="client-ticket-message client-admin-reply-box">
              <span>NetPro Reply</span>
              <p>{ticket.adminReply}</p>
            </div>
          ) : (
            <div className="client-empty-state">
              <i className="bi bi-chat-dots"></i>
              <h3>Belum ada balasan</h3>
              <p>Tim NetPro akan membalas ticket Anda segera.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}