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
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  completedProjects: number;
  planningProjects: number;
  implementationProjects: number;
  cancelledProjects: number;
  tickets: number;
  openTickets: number;
  invoices: number;
  unpaidInvoices: number;
  paidRevenue: number;
  contacts: number;
  consultations: number;
  newConsultations: number;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    bookings: 0,
    pendingBookings: 0,
    projects: 0,
    activeProjects: 0,
    completedProjects: 0,
    planningProjects: 0,
    implementationProjects: 0,
    cancelledProjects: 0,
    tickets: 0,
    openTickets: 0,
    invoices: 0,
    unpaidInvoices: 0,
    paidRevenue: 0,
    contacts: 0,
    consultations: 0,
    newConsultations: 0,
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
        consultationsSnap,
      ] = await Promise.all([
        getDocs(collection(db, "bookings")),
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "tickets")),
        getDocs(collection(db, "invoices")),
        getDocs(collection(db, "contacts")),
        getDocs(collection(db, "consultations")),
      ]);

      const bookings = bookingsSnap.docs.map((doc) => doc.data());
      const projects = projectsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      const tickets = ticketsSnap.docs.map((doc) => doc.data());
      const invoices = invoicesSnap.docs.map((doc) => doc.data());
      const consultations = consultationsSnap.docs.map((doc) => doc.data());

      const paidRevenue = invoices
        .filter((invoice: any) => invoice.status === "paid")
        .reduce(
          (total: number, invoice: any) => total + Number(invoice.amount || 0),
          0
        );

      const planningProjects = projects.filter(
        (item) => item.status === "planning"
      ).length;

      const implementationProjects = projects.filter(
        (item) => item.status === "implementation"
      ).length;

      const completedProjects = projects.filter(
        (item) => item.status === "completed"
      ).length;

      const cancelledProjects = projects.filter(
        (item) => item.status === "cancelled"
      ).length;

      setStats({
        bookings: bookingsSnap.size,
        pendingBookings: bookings.filter(
          (item: any) => item.status === "pending"
        ).length,
        projects: projectsSnap.size,
        activeProjects: planningProjects + implementationProjects,
        completedProjects,
        planningProjects,
        implementationProjects,
        cancelledProjects,
        tickets: ticketsSnap.size,
        openTickets: tickets.filter(
          (item: any) =>
            item.status === "open" || item.status === "in-progress"
        ).length,
        invoices: invoicesSnap.size,
        unpaidInvoices: invoices.filter(
          (invoice: any) => invoice.status === "unpaid"
        ).length,
        paidRevenue,
        contacts: contactsSnap.size,
        consultations: consultationsSnap.size,
        newConsultations: consultations.filter(
          (item: any) => item.status === "New" || item.status === "new" || !item.status
        ).length,
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

  const completionRate = useMemo(() => {
    if (stats.projects === 0) return 0;
    return Math.round((stats.completedProjects / stats.projects) * 100);
  }, [stats.projects, stats.completedProjects]);

  const statCards = [
    {
      label: "Total Projects",
      value: stats.projects,
      trend: `${stats.activeProjects} active projects`,
      icon: "bi-kanban",
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      trend: `${stats.bookings} total bookings`,
      icon: "bi-calendar-check",
    },
    {
      label: "Consultations",
      value: stats.newConsultations,
      trend: `${stats.consultations} total consultations`,
      icon: "bi-chat-square-text",
    },
    {
      label: "Paid Revenue",
      value: formatCurrency(stats.paidRevenue),
      trend: `${stats.invoices} total invoices`,
      icon: "bi-cash-stack",
    },
  ];

  const projectStatusData = [
    { name: "Planning", value: stats.planningProjects },
    { name: "Implementation", value: stats.implementationProjects },
    { name: "Completed", value: stats.completedProjects },
    { name: "Cancelled", value: stats.cancelledProjects },
  ];

  const businessChartData = [
    { name: "Bookings", value: stats.bookings },
    { name: "Consultations", value: stats.consultations },
    { name: "Projects", value: stats.projects },
    { name: "Invoices", value: stats.invoices },
    { name: "Tickets", value: stats.tickets },
  ];

  const healthCards = [
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      status: "Completed project ratio",
    },
    {
      label: "Open Tickets",
      value: String(stats.openTickets),
      status: `${stats.tickets} total support tickets`,
    },
    {
      label: "Unpaid Invoices",
      value: String(stats.unpaidInvoices),
      status: "Need payment follow-up",
    },
    {
      label: "Lead Contacts",
      value: String(stats.contacts),
      status: "Public contact messages",
    },
  ];

  return (
    <>
      <AdminNavbar />

      <section className="admin-content">
        <div className="admin-page-header">
          <div>
            <span>Business Analytics</span>
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
                <span>Business Chart</span>
                <h2>Operational summary</h2>
              </div>
            </div>

            <div className="admin-chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={businessChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span>Project Analytics</span>
                <h2>Status distribution</h2>
              </div>
            </div>

            <div className="admin-chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {projectStatusData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ["#f59e0b", "#2563eb", "#10b981", "#ef4444"][index]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="admin-chart-legend">
                {projectStatusData.map((item, index) => (
                  <div key={item.name}>
                    <span
                      style={{
                        background:
                          ["#f59e0b", "#2563eb", "#10b981", "#ef4444"][index],
                      }}
                    ></span>
                    {item.name}: {item.value}
                  </div>
                ))}
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

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span>Business Summary</span>
                <h2>Operational insight</h2>
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
                <p>
                  {stats.newConsultations} konsultasi baru perlu ditindaklanjuti.
                </p>
              </div>

              <div className="admin-activity-item">
                <span>3</span>
                <p>
                  Total revenue paid saat ini adalah{" "}
                  {formatCurrency(stats.paidRevenue)}.
                </p>
              </div>

              <div className="admin-activity-item">
                <span>4</span>
                <p>
                  Completion rate project mencapai {completionRate}% dari total{" "}
                  {stats.projects} project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}