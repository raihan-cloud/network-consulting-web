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
  isRead: boolean;
  createdAt?: any;
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadNotifications() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "notifications"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as NotificationItem[];

      setNotifications(data);
    } catch (error) {
      console.error("LOAD NOTIFICATIONS ERROR:", error);
      alert("Gagal memuat notifikasi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

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

    return new Date(timestamp.seconds * 1000).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
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
    <section className="admin-content">
      <div className="admin-page-header">
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

      <div className="admin-notification-summary">
        <div>
          <span>Total Notifications</span>
          <strong>{notifications.length}</strong>
        </div>

        <div>
          <span>Unread</span>
          <strong>{unreadCount}</strong>
        </div>

        <div>
          <span>Read</span>
          <strong>{notifications.length - unreadCount}</strong>
        </div>
      </div>

      <div className="admin-notification-list">
        {loading ? (
          <div className="admin-table-card">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="admin-table-card">Belum ada notifikasi.</div>
        ) : (
          notifications.map((item) => (
            <article
              className={`admin-notification-card ${
                item.isRead ? "read" : "unread"
              }`}
              key={item.id}
            >
              <div className="admin-notification-icon">
                <i className={`bi ${getIcon(item.type)}`}></i>
              </div>

              <div className="admin-notification-content">
                <div className="admin-notification-top">
                  <div>
                    <small>{item.type}</small>
                    <h3>{item.title}</h3>
                  </div>

                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <p>{item.message}</p>

                <div className="admin-notification-actions">
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
          ))
        )}
      </div>
    </section>
  );
}