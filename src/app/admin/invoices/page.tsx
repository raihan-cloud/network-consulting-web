"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

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
  createdAt?: any;
};

type StatusFilter = "all" | InvoiceStatus;

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  async function loadInvoices() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "invoices"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Invoice[];

      setInvoices(data);
    } catch (error) {
      console.error("LOAD INVOICES ERROR:", error);
      alert("Gagal mengambil data invoice.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const keyword = searchTerm.toLowerCase();

      const matchesSearch =
        invoice.id.toLowerCase().includes(keyword) ||
        invoice.clientName?.toLowerCase().includes(keyword) ||
        invoice.clientEmail?.toLowerCase().includes(keyword) ||
        invoice.projectName?.toLowerCase().includes(keyword) ||
        invoice.title?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const handleUpdateStatus = async (
    invoiceId: string,
    status: InvoiceStatus
  ) => {
    try {
      setUpdatingId(invoiceId);

      await updateInvoiceStatus(invoiceId, status);
      await loadInvoices();

      alert(`Invoice berhasil diubah menjadi ${status}.`);
    } catch (error) {
      console.error("UPDATE INVOICE ERROR:", error);
      alert("Gagal mengubah status invoice.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((total, invoice) => total + (invoice.amount || 0), 0);

  const pendingCount = invoices.filter(
    (invoice) => invoice.status === "unpaid"
  ).length;

  const paidCount = invoices.filter(
    (invoice) => invoice.status === "paid"
  ).length;

  const overdueCount = invoices.filter(
    (invoice) => invoice.status === "overdue"
  ).length;

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Invoices</span>
          <h1>Billing Management</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadInvoices}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="invoice-admin-stats">
        <div className="invoice-admin-stat">
          <span>Paid Revenue</span>
          <strong>{formatCurrency(totalRevenue)}</strong>
          <small>Total paid invoice</small>
        </div>

        <div className="invoice-admin-stat">
          <span>Pending Payment</span>
          <strong>{pendingCount}</strong>
          <small>Waiting Payment</small>
        </div>

        <div className="invoice-admin-stat">
          <span>Paid</span>
          <strong>{paidCount}</strong>
          <small>Completed</small>
        </div>

        <div className="invoice-admin-stat">
          <span>Overdue</span>
          <strong>{overdueCount}</strong>
          <small>Need Attention</small>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-search">
            <i className="bi bi-search"></i>
            <input
              placeholder="Search invoice, client, project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilter)
            }
          >
            <option value="all">All Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Client</th>
                <th>Project</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>Loading invoices...</td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    Tidak ada invoice yang cocok.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <strong>#{invoice.id.slice(0, 8)}</strong>
                    </td>

                    <td>
                      <strong>{invoice.clientName}</strong>
                      <br />
                      <small>{invoice.clientEmail}</small>
                    </td>

                    <td>{invoice.projectName}</td>

                    <td>{invoice.title}</td>

                    <td>
                      <strong>{formatCurrency(invoice.amount)}</strong>
                    </td>

                    <td>{invoice.dueDate || "-"}</td>

                    <td>
                      <span
                        className={`invoice-admin-status ${invoice.status}`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="text-end">
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        className="btn btn-light btn-sm me-2"
                      >
                        View
                      </Link>

                      {invoice.status !== "paid" && (
                        <button
                          className="btn btn-outline-success btn-sm me-2"
                          disabled={updatingId === invoice.id}
                          onClick={() =>
                            handleUpdateStatus(invoice.id, "paid")
                          }
                        >
                          Mark Paid
                        </button>
                      )}

                      {invoice.status === "unpaid" && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          disabled={updatingId === invoice.id}
                          onClick={() =>
                            handleUpdateStatus(invoice.id, "overdue")
                          }
                        >
                          Overdue
                        </button>
                      )}
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