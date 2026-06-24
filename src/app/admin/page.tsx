"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  clientName: string;
  progress: number;
  status: string;
};

type DashboardStats = {
  bookings: number;
  pendingBookings: number;
  projects: number;
  activeProjects: number;
  tickets: number;
  openTickets: number;
  invoices: number;
  paidRevenue: number;
  contacts: number;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    bookings: 0,
    pendingBookings: 0,
    projects: 0,
    activeProjects: 0,
    tickets: 0,
    openTickets: 0,
    invoices: 0,
    paidRevenue: 0,
    contacts: 0,
  });

  async function loadDashboardData() {
    try {
      setLoading(true);

      const [
        bookingsSnap,
        projectsSnap,
        ticketsSnap,
        invoicesSnap,
        contactsSnap,
      ] = await Promise.all([
        getDocs(collection(db, "bookings")),
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "tickets")),
        getDocs(collection(db, "invoices")),
        getDocs(collection(db, "contacts")),
      ]);

      const bookings = bookingsSnap.docs.map((doc) => doc.data());
      const projects = projectsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      const tickets = ticketsSnap.docs.map((doc) => doc.data());
      const invoices = invoicesSnap.docs.map((doc) => doc.data());

      const paidRevenue = invoices
        .filter((invoice: any) => invoice.status === "paid")
        .reduce(
          (total: number, invoice: any) =>
            total + Number(invoice.amount || 0),
          0
        );

      setStats({
        bookings: bookingsSnap.size,
        pendingBookings: bookings.filter(
          (item: any) => item.status === "pending"
        ).length,
        projects: projectsSnap.size,
        activeProjects: projects.filter(
          (item: any) =>
            item.status === "planning" ||
            item.status === "implementation"
        ).length,
        tickets: ticketsSnap.size,
        openTickets: tickets.filter(
          (item: any) =>
            item.status === "open" ||
            item.status === "in-progress"
        ).length,
        invoices: invoicesSnap.size,
        paidRevenue,
        contacts: contactsSnap.size,
      });

      const recentProjectsQuery = query(
        collection(db, "projects"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const recentProjectsSnap = await getDocs(recentProjectsQuery);

      const recentProjectsData = recentProjectsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      setRecentProjects(recentProjectsData);
    } catch (error) {
      console.error("LOAD ADMIN DASHBOARD ERROR:", error);
      alert("Gagal memuat data dashboard admin.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const statCards = [
    {
      label: "Active Projects",
      value: stats.activeProjects,
      trend: `${stats.projects} total projects`,
      icon: "bi-kanban",
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      trend: `${stats.bookings} total bookings`,
      icon: "bi-calendar-check",
    },
    {
      label: "Open Tickets",
      value: stats.openTickets,
      trend: `${stats.tickets} total tickets`,
      icon: "bi-headset",
    },
    {
      label: "Paid Revenue",
      value: formatCurrency(stats.paidRevenue),
      trend: `${stats.invoices} total invoices`,
      icon: "bi-cash-stack",
    },
  ];

  const healthCards = [
    {
      label: "Project Health",
      value:
        stats.projects > 0
          ? `${Math.round((stats.activeProjects / stats.projects) * 100)}%`
          : "0%",
      status: "Active workload",
    },
    {
      label: "Lead Contacts",
      value: String(stats.contacts),
      status: "Public contact messages",
    },
    {
      label: "Invoice Count",
      value: String(stats.invoices),
      status: "Billing records",
    },
    {
      label: "Infrastructure Status",
      value: "100%",
      status: "Operational",
    },
  ];

  return (
    <>
      <AdminNavbar />

      <section className="admin-content">
        <div className="admin-page-header">
          <div>
            <span>Realtime Overview</span>
            <h1>Operations Dashboard</h1>
          </div>

          <button
            className="btn btn-warning"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="admin-stats-grid">
          {statCards.map((stat) => (
            <div className="admin-stat-card" key={stat.label}>
              <div className="admin-stat-icon">
                <i className={`bi ${stat.icon}`}></i>
              </div>

              <div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.trend}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-health-grid">
          {healthCards.map((item) => (
            <div className="admin-health-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.status}</p>
            </div>
          ))}
        </div>

        <div className="admin-dashboard-grid">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span>Operations Feed</span>
                <h2>System summary</h2>
              </div>
            </div>

            <div className="admin-activity-list">
              <div className="admin-activity-item">
                <span>1</span>
                <p>
                  {stats.pendingBookings} booking masih menunggu review admin.
                </p>
              </div>

              <div className="admin-activity-item">
                <span>2</span>
                <p>{stats.openTickets} support ticket masih aktif.</p>
              </div>

              <div className="admin-activity-item">
                <span>3</span>
                <p>
                  Total pendapatan dari invoice paid adalah{" "}
                  {formatCurrency(stats.paidRevenue)}.
                </p>
              </div>

              <div className="admin-activity-item">
                <span>4</span>
                <p>{stats.contacts} pesan contact masuk dari website publik.</p>
              </div>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span>Project Monitoring</span>
                <h2>Recent project progress</h2>
              </div>
            </div>

            <div className="admin-project-list">
              {recentProjects.length === 0 ? (
                <div className="admin-project-row">
                  <strong>Belum ada project</strong>
                  <small>Project akan muncul setelah dibuat dari booking.</small>
                </div>
              ) : (
                recentProjects.map((project) => (
                  <div className="admin-project-row" key={project.id}>
                    <div className="d-flex justify-content-between gap-3">
                      <div>
                        <strong>{project.name}</strong>
                        <small>{project.clientName}</small>
                      </div>

                      <span>{project.progress || 0}%</span>
                    </div>

                    <div className="admin-progress">
                      <div
                        style={{
                          width: `${project.progress || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}