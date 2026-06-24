"use client";

import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

type Project = {
  id: string;
  name: string;
  status: string;
  progress: number;
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt?: any;
};

export default function DashboardPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<NotificationItem[]>([]);

  const [stats, setStats] = useState({
    activeProjects: 0,
    bookings: 0,
    unpaidInvoices: 0,
    supportTickets: 0,
  });

  async function loadDashboardData() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const projectsQuery = query(
        collection(db, "projects"),
        where("userId", "==", user.uid),
        orderBy("updatedAt", "desc"),
        limit(5)
      );

      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );

      const invoicesQuery = query(
        collection(db, "invoices"),
        where("userId", "==", user.uid)
      );

      const ticketsQuery = query(
        collection(db, "tickets"),
        where("userId", "==", user.uid)
      );

      const notificationsQuery = query(
        collection(db, "notifications"),
        where("targetUserId", "==", user.uid),
        where("targetRole", "==", "client"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const [
        projectsSnap,
        bookingsSnap,
        invoicesSnap,
        ticketsSnap,
        notificationsSnap,
      ] = await Promise.all([
        getDocs(projectsQuery),
        getDocs(bookingsQuery),
        getDocs(invoicesQuery),
        getDocs(ticketsQuery),
        getDocs(notificationsQuery),
      ]);

      const projectData = projectsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      const invoiceData = invoicesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      const ticketData = ticketsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      const notificationData = notificationsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as NotificationItem[];

      setProjects(projectData);
      setActivities(notificationData);

      setStats({
        activeProjects: projectData.filter(
          (project) => project.status !== "completed"
        ).length,
        bookings: bookingsSnap.size,
        unpaidInvoices: invoiceData.filter(
          (invoice) => invoice.status === "unpaid"
        ).length,
        supportTickets: ticketData.filter(
          (ticket) =>
            ticket.status === "open" ||
            ticket.status === "in-progress"
        ).length,
      });
    } catch (error) {
      console.error("LOAD CLIENT DASHBOARD ERROR:", error);
      alert("Gagal memuat dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const statCards = [
    {
      label: "Active Projects",
      value: stats.activeProjects,
      desc: "Currently in progress",
      icon: "bi-kanban",
    },
    {
      label: "Bookings",
      value: stats.bookings,
      desc: "Total booking requests",
      icon: "bi-calendar-check",
    },
    {
      label: "Invoices",
      value: stats.unpaidInvoices,
      desc: "Waiting payment",
      icon: "bi-receipt",
    },
    {
      label: "Support Tickets",
      value: stats.supportTickets,
      desc: "Open or in progress",
      icon: "bi-headset",
    },
  ];

  return (
    <>
      <DashboardNavbar />

      <section className="client-dashboard-content">
        <div className="client-page-header">
          <div>
            <span>Overview</span>
            <h1>Client Dashboard</h1>
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

        <div className="client-stats-grid">
          {statCards.map((stat) => (
            <div className="client-stat-card" key={stat.label}>
              <div className="client-stat-icon">
                <i className={`bi ${stat.icon}`}></i>
              </div>

              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <p>{stat.desc}</p>
            </div>
          ))}
        </div>

        <div className="client-dashboard-grid">
          <div className="client-panel">
            <div className="client-panel-header">
              <div>
                <span>Activity</span>
                <h2>Recent updates</h2>
              </div>
            </div>

            {loading ? (
              <div className="client-empty-state">
                <h3>Loading activity...</h3>
              </div>
            ) : activities.length === 0 ? (
              <div className="client-empty-state">
                <i className="bi bi-bell"></i>
                <h3>Belum ada aktivitas</h3>
                <p>Update project, invoice, dan booking akan muncul di sini.</p>
              </div>
            ) : (
              <div className="client-activity-list">
                {activities.map((activity, index) => (
                  <div className="client-activity-item" key={activity.id}>
                    <span>{index + 1}</span>
                    <p>
                      <strong>{activity.title}</strong>
                      <br />
                      {activity.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="client-panel">
            <div className="client-panel-header">
              <div>
                <span>Projects</span>
                <h2>Project timeline</h2>
              </div>
            </div>

            {loading ? (
              <div className="client-empty-state">
                <h3>Loading projects...</h3>
              </div>
            ) : projects.length === 0 ? (
              <div className="client-empty-state">
                <i className="bi bi-kanban"></i>
                <h3>Belum ada project</h3>
                <p>Project akan muncul setelah booking disetujui admin.</p>
              </div>
            ) : (
              <div className="client-project-list">
                {projects.map((project) => (
                  <div className="client-project-item" key={project.id}>
                    <div className="d-flex justify-content-between gap-3">
                      <div>
                        <strong>{project.name}</strong>
                        <small>{project.status}</small>
                      </div>

                      <span>{project.progress || 0}%</span>
                    </div>

                    <div className="client-progress">
                      <div
                        style={{
                          width: `${project.progress || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}