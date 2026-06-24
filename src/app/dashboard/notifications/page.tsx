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
import {
  deleteNotification,
  markNotificationAsRead,
  NotificationType,
} from "@/lib/notificationService";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string | null;
  referencePath?: string | null;
  targetUserId?: string | null;
  targetRole?: "admin" | "client";
  isRead: boolean;
  createdAt?: any;
};

export default function DashboardNotificationsPage() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadNotifications() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "notifications"),
        where("targetUserId", "==", user.uid),
        where("targetRole", "==", "client"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as NotificationItem[];

      setNotifications(data);
    } catch (error) {
      console.error("LOAD CLIENT NOTIFICATIONS ERROR:", error);
      alert("Gagal memuat notifikasi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkRead = async (notificationId: string) => {
    try {
      setUpdatingId(notificationId);

      await markNotificationAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error("MARK READ ERROR:", error);
      alert("Gagal mengubah status notifikasi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (notificationId: string) => {
    const confirmDelete = confirm("Hapus notifikasi ini?");

    if (!confirmDelete) return;

    try {
      setUpdatingId(notificationId);

      await deleteNotification(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error("DELETE NOTIFICATION ERROR:", error);
      alert("Gagal menghapus notifikasi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "-";

    return new Date(timestamp.seconds * 1000).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getIcon = (type: NotificationType) => {
    if (type === "booking") return "bi-calendar-check";
    if (type === "ticket") return "bi-headset";
    if (type === "contact") return "bi-envelope";
    if (type === "invoice") return "bi-receipt";
    if (type === "project") return "bi-kanban";
    if (type === "document") return "bi-folder2-open";

    return "bi-bell";
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Notifications</span>
          <h1>Notification Center</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadNotifications}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="invoice-summary-grid">
        <div className="invoice-summary-card">
          <span>Total Notifications</span>
          <strong>{notifications.length}</strong>
          <p>Semua notifikasi akun Anda</p>
        </div>

        <div className="invoice-summary-card">
          <span>Unread</span>
          <strong>{unreadCount}</strong>
          <p>Belum dibaca</p>
        </div>

        <div className="invoice-summary-card">
          <span>Read</span>
          <strong>{notifications.length - unreadCount}</strong>
          <p>Sudah dibaca</p>
        </div>
      </div>

      {loading ? (
        <div className="client-empty-state">
          <h3>Loading notifications...</h3>
        </div>
      ) : notifications.length === 0 ? (
        <div className="client-empty-state">
          <i className="bi bi-bell"></i>
          <h3>Belum ada notifikasi</h3>
          <p>Update booking, project, invoice, dan ticket akan muncul di sini.</p>
        </div>
      ) : (
        <div className="client-notification-list">
          {notifications.map((item) => (
            <article
              className={`client-notification-card ${
                item.isRead ? "read" : "unread"
              }`}
              key={item.id}
            >
              <div className="client-notification-icon">
                <i className={`bi ${getIcon(item.type)}`}></i>
              </div>

              <div className="client-notification-content">
                <div className="client-notification-top">
                  <div>
                    <small>{item.type}</small>
                    <h3>{item.title}</h3>
                  </div>

                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <p>{item.message}</p>

                <div className="client-notification-actions">
                  {item.referencePath && (
                    <Link
                      href={item.referencePath}
                      className="btn btn-light btn-sm"
                    >
                      Open
                    </Link>
                  )}

                  {!item.isRead && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={updatingId === item.id}
                      onClick={() => handleMarkRead(item.id)}
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    className="btn btn-outline-danger btn-sm"
                    disabled={updatingId === item.id}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}