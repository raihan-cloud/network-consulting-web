"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    projects: 0,
    tickets: 0,
    invoices: 0,
    contacts: 0,
    revenue: 0,
    unpaidAmount: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
  });

  async function loadReports() {
    try {
      setLoading(true);

      const [
        usersCount,
        bookingsCount,
        projectsCount,
        ticketsCount,
        invoicesCount,
        contactsCount,
      ] = await Promise.all([
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "bookings")),
        getCountFromServer(collection(db, "projects")),
        getCountFromServer(collection(db, "tickets")),
        getCountFromServer(collection(db, "invoices")),
        getCountFromServer(collection(db, "contacts")),
      ]);

      const invoiceSnapshot = await getDocs(collection(db, "invoices"));

      let revenue = 0;
      let unpaidAmount = 0;
      let paidInvoices = 0;
      let unpaidInvoices = 0;

      invoiceSnapshot.forEach((document) => {
        const invoice = document.data();
        const amount = Number(invoice.amount || 0);

        if (invoice.status === "paid") {
          revenue += amount;
          paidInvoices += 1;
        }

        if (invoice.status === "unpaid") {
          unpaidAmount += amount;
          unpaidInvoices += 1;
        }
      });

      setStats({
        users: usersCount.data().count,
        bookings: bookingsCount.data().count,
        projects: projectsCount.data().count,
        tickets: ticketsCount.data().count,
        invoices: invoicesCount.data().count,
        contacts: contactsCount.data().count,
        revenue,
        unpaidAmount,
        paidInvoices,
        unpaidInvoices,
      });
    } catch (error) {
      console.error("LOAD REPORTS ERROR:", error);
      alert("Gagal memuat laporan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Reports</span>
          <h1>Business Analytics</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadReports}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="report-kpi-grid">
        <div className="report-kpi-card">
          <span>Total Revenue</span>
          <strong>{formatCurrency(stats.revenue)}</strong>
          <small>Paid invoices only</small>
        </div>

        <div className="report-kpi-card">
          <span>Unpaid Amount</span>
          <strong>{formatCurrency(stats.unpaidAmount)}</strong>
          <small>{stats.unpaidInvoices} unpaid invoices</small>
        </div>

        <div className="report-kpi-card">
          <span>Total Projects</span>
          <strong>{stats.projects}</strong>
          <small>Active and completed projects</small>
        </div>

        <div className="report-kpi-card">
          <span>Total Clients</span>
          <strong>{stats.users}</strong>
          <small>Registered accounts</small>
        </div>
      </div>

      <div className="report-layout">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Operations Summary</span>
              <h2>System Overview</h2>
            </div>
          </div>

          <div className="report-summary-list">
            <div>
              <strong>Bookings</strong>
              <span>{stats.bookings}</span>
            </div>

            <div>
              <strong>Projects</strong>
              <span>{stats.projects}</span>
            </div>

            <div>
              <strong>Tickets</strong>
              <span>{stats.tickets}</span>
            </div>

            <div>
              <strong>Contacts</strong>
              <span>{stats.contacts}</span>
            </div>

            <div>
              <strong>Invoices</strong>
              <span>{stats.invoices}</span>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Billing Summary</span>
              <h2>Invoice Performance</h2>
            </div>
          </div>

          <div className="report-list">
            <div className="report-item">
              <div>
                <strong>Paid Invoices</strong>
                <small>Total invoice paid by clients</small>
              </div>
              <span className="report-status generated">
                {stats.paidInvoices}
              </span>
            </div>

            <div className="report-item">
              <div>
                <strong>Unpaid Invoices</strong>
                <small>Waiting for payment</small>
              </div>
              <span className="report-status pending">
                {stats.unpaidInvoices}
              </span>
            </div>

            <div className="report-item">
              <div>
                <strong>Payment Ready</strong>
                <small>Midtrans/Xendit structure prepared</small>
              </div>
              <span className="report-status generated">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}