"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

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

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  async function loadTickets() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "tickets"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Ticket[];

      setTickets(data);
    } catch (error) {
      console.error("LOAD ADMIN TICKETS ERROR:", error);
      alert("Gagal mengambil data ticket.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  const handleUpdateStatus = async (
    ticketId: string,
    status: TicketStatus
  ) => {
    try {
      setUpdatingId(ticketId);

      await updateTicketStatus(ticketId, status);
      await loadTickets();

      alert(`Ticket berhasil diubah menjadi ${status}.`);
    } catch (error) {
      console.error("UPDATE TICKET ERROR:", error);
      alert("Gagal mengubah status ticket.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReply = async (ticketId: string) => {
    const text = replyText[ticketId];

    if (!text || !text.trim()) {
      alert("Balasan admin tidak boleh kosong.");
      return;
    }

    try {
      setUpdatingId(ticketId);

      await replyTicket(ticketId, text);

      setReplyText({
        ...replyText,
        [ticketId]: "",
      });

      await loadTickets();

      alert("Balasan berhasil dikirim.");
    } catch (error) {
      console.error("REPLY TICKET ERROR:", error);
      alert("Gagal mengirim balasan.");
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

  const openCount = tickets.filter(
    (ticket) => ticket.status === "open"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === "in-progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "resolved"
  ).length;

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Support</span>
          <h1>Support Center</h1>
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

      <div className="admin-support-stats">
        <div>
          <span>Open Tickets</span>
          <strong>{openCount}</strong>
          <small>Need response</small>
        </div>

        <div>
          <span>In Progress</span>
          <strong>{progressCount}</strong>
          <small>Handled by engineer</small>
        </div>

        <div>
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
          <small>This month</small>
        </div>

        <div>
          <span>Total Tickets</span>
          <strong>{tickets.length}</strong>
          <small>All tickets</small>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Client</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Updated</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>Loading tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={8}>Belum ada ticket masuk.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <strong>#{ticket.id.slice(0, 8)}</strong>
                    </td>

                    <td>
                      <strong>{ticket.clientName}</strong>
                      <br />
                      <small>{ticket.clientEmail}</small>
                    </td>

                    <td>
                      <strong>{ticket.subject}</strong>
                      <br />
                      <small>{ticket.description}</small>

                      {ticket.adminReply && (
                        <>
                          <br />
                          <small>
                            <strong>Reply:</strong> {ticket.adminReply}
                          </small>
                        </>
                      )}
                    </td>

                    <td>{ticket.category}</td>

                    <td>
                      <span className={`admin-priority ${ticket.priority}`}>
                        {ticket.priority}
                      </span>
                    </td>

                    <td>
                      <span className={`admin-ticket-status ${ticket.status}`}>
                        {ticket.status}
                      </span>
                    </td>

                    <td>
                      {formatDate(ticket.updatedAt || ticket.createdAt)}
                    </td>

                    <td className="text-end">
                      <div className="admin-ticket-actions">
                        <Link
                          href={`/admin/support/${ticket.id}`}
                          className="btn btn-light btn-sm w-100 mb-2"
                        >
                          View Detail
                        </Link>

                        <select
                          className="form-select form-select-sm"
                          value={ticket.status}
                          disabled={updatingId === ticket.id}
                          onChange={(e) =>
                            handleUpdateStatus(
                              ticket.id,
                              e.target.value as TicketStatus
                            )
                          }
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>

                        <textarea
                          className="form-control form-control-sm mt-2"
                          rows={2}
                          placeholder="Balas ticket..."
                          value={replyText[ticket.id] || ""}
                          onChange={(e) =>
                            setReplyText({
                              ...replyText,
                              [ticket.id]: e.target.value,
                            })
                          }
                        ></textarea>

                        <button
                          className="btn btn-outline-primary btn-sm mt-2 w-100"
                          disabled={updatingId === ticket.id}
                          onClick={() => handleReply(ticket.id)}
                        >
                          {updatingId === ticket.id
                            ? "Sending..."
                            : "Reply"}
                        </button>
                      </div>
                    </td>
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