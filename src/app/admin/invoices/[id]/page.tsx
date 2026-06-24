"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  InvoiceStatus,
  updateInvoiceStatus,
} from "@/lib/invoiceService";

type Invoice = {
  id: string;
  projectId: string;
  bookingId?: string | null;
  userId?: string | null;
  clientName: string;
  clientEmail: string;
  projectName: string;
  title: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  paymentMethod?: string | null;
  paymentUrl?: string | null;
  createdAt?: any;
  updatedAt?: any;
};

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function loadInvoice() {
    try {
      setLoading(true);

      const invoiceRef = doc(db, "invoices", invoiceId);
      const invoiceSnap = await getDoc(invoiceRef);

      if (!invoiceSnap.exists()) {
        setInvoice(null);
        return;
      }

      setInvoice({
        id: invoiceSnap.id,
        ...invoiceSnap.data(),
      } as Invoice);
    } catch (error) {
      console.error("LOAD ADMIN INVOICE DETAIL ERROR:", error);
      alert("Gagal memuat detail invoice.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  const handleStatusChange = async (status: InvoiceStatus) => {
    try {
      setUpdating(true);

      await updateInvoiceStatus(invoiceId, status);
      await loadInvoice();

      alert(`Invoice berhasil diubah menjadi ${status}.`);
    } catch (error) {
      console.error("UPDATE INVOICE STATUS ERROR:", error);
      alert("Gagal mengubah status invoice.");
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
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
        <div className="admin-table-card">Loading invoice detail...</div>
      </section>
    );
  }

  if (!invoice) {
    return (
      <section className="admin-content">
        <div className="admin-table-card">
          Invoice tidak ditemukan.
        </div>
      </section>
    );
  }

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Invoice Detail</span>
          <h1>{invoice.title}</h1>
        </div>

        <Link href="/admin/invoices" className="btn btn-light">
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </Link>
      </div>

      <div className="admin-invoice-detail-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Billing Information</span>
              <h2>Invoice Overview</h2>
            </div>
          </div>

          <div className="invoice-detail-grid">
            <div>
              <span>Invoice ID</span>
              <strong>#{invoice.id.slice(0, 8)}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{invoice.status}</strong>
            </div>

            <div>
              <span>Client</span>
              <strong>{invoice.clientName}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{invoice.clientEmail}</strong>
            </div>

            <div>
              <span>Project</span>
              <strong>{invoice.projectName}</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>{formatCurrency(invoice.amount)}</strong>
            </div>

            <div>
              <span>Due Date</span>
              <strong>{invoice.dueDate || "-"}</strong>
            </div>

            <div>
              <span>Created</span>
              <strong>{formatDate(invoice.createdAt)}</strong>
            </div>
          </div>
        </div>

        <aside className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Actions</span>
              <h2>Payment Status</h2>
            </div>
          </div>

          <div className="admin-invoice-actions">
            <button
              className="btn btn-outline-warning w-100"
              disabled={updating}
              onClick={() => handleStatusChange("unpaid")}
            >
              Mark Unpaid
            </button>

            <button
              className="btn btn-outline-success w-100"
              disabled={updating}
              onClick={() => handleStatusChange("paid")}
            >
              Mark Paid
            </button>

            <button
              className="btn btn-outline-danger w-100"
              disabled={updating}
              onClick={() => handleStatusChange("overdue")}
            >
              Mark Overdue
            </button>

            <button
              className="btn btn-outline-secondary w-100"
              disabled={updating}
              onClick={() => handleStatusChange("cancelled")}
            >
              Cancel Invoice
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}