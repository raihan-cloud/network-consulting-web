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
import type { InvoiceStatus } from "@/lib/invoiceService";

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
  createdAt?: any;
};

export default function DashboardInvoicesPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  async function loadInvoices() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "invoices"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Invoice[];

      setInvoices(data);
    } catch (error) {
      console.error("LOAD CLIENT INVOICES ERROR:", error);
      alert("Gagal mengambil data invoice.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, [user]);

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

  const totalDue = invoices
    .filter((invoice) => invoice.status === "unpaid")
    .reduce((total, invoice) => total + (invoice.amount || 0), 0);

  const totalPaid = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((total, invoice) => total + (invoice.amount || 0), 0);

  const totalOverdue = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((total, invoice) => total + (invoice.amount || 0), 0);

  const getStatusClass = (status: InvoiceStatus) => {
    if (status === "paid") return "paid";
    if (status === "overdue") return "overdue";
    return "waiting";
  };

  return (
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Invoices</span>
          <h1>Billing & Invoices</h1>
        </div>

        <button className="btn btn-warning" onClick={loadInvoices}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      <div className="invoice-summary-grid">
        <div className="invoice-summary-card">
          <span>Total Due</span>
          <strong>{formatCurrency(totalDue)}</strong>
          <p>
            {
              invoices.filter((invoice) => invoice.status === "unpaid")
                .length
            }{" "}
            invoices need attention
          </p>
        </div>

        <div className="invoice-summary-card">
          <span>Paid</span>
          <strong>{formatCurrency(totalPaid)}</strong>
          <p>
            {
              invoices.filter((invoice) => invoice.status === "paid")
                .length
            }{" "}
            invoice completed
          </p>
        </div>

        <div className="invoice-summary-card">
          <span>Overdue</span>
          <strong>{formatCurrency(totalOverdue)}</strong>
          <p>Payment deadline passed</p>
        </div>
      </div>

      {loading ? (
        <div className="client-empty-state">
          <h3>Loading invoices...</h3>
        </div>
      ) : invoices.length === 0 ? (
        <div className="client-empty-state">
          <i className="bi bi-receipt"></i>

          <h3>Belum ada invoice</h3>

          <p>
            Invoice akan muncul setelah admin membuat tagihan
            untuk project Anda.
          </p>
        </div>
      ) : (
        <div className="client-invoice-list">
          {invoices.map((invoice) => (
            <article
              className="client-invoice-card"
              key={invoice.id}
            >
              <div className="invoice-main">
                <div>
                  <small>#{invoice.id.slice(0, 8)}</small>

                  <h3>{invoice.title}</h3>

                  <p>{invoice.projectName}</p>
                </div>

                <span
                  className={`invoice-status ${getStatusClass(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
              </div>

              <div className="invoice-meta">
                <div>
                  <span>Amount</span>
                  <strong>
                    {formatCurrency(invoice.amount)}
                  </strong>
                </div>

                <div>
                  <span>Issued</span>
                  <strong>
                    {formatDate(invoice.createdAt)}
                  </strong>
                </div>

                <div>
                  <span>Due Date</span>
                  <strong>{invoice.dueDate || "-"}</strong>
                </div>
              </div>

              <div className="invoice-actions">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="btn btn-light"
                >
                  <i className="bi bi-eye me-2"></i>
                  Preview
                </Link>

                <button className="btn btn-outline-primary">
                  <i className="bi bi-download me-2"></i>
                  Download
                </button>

                {invoice.status !== "paid" && (
                 <Link
                href={`/dashboard/invoices/${invoice.id}`}
                className="btn btn-warning"
              >
                <i className="bi bi-wallet2 me-2"></i>
                Pay Now
              </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}