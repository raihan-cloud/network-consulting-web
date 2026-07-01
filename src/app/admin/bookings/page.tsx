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
  BookingStatus,
  updateBookingStatus,
} from "@/lib/bookingService";
import { createProjectFromBooking } from "@/lib/projectService";

type Booking = {
  id: string;
  userId?: string | null;
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  packageType: string;
  location: string;
  amount: number;
  status: BookingStatus;
  createdAt?: any;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadBookings() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Booking[];

      setBookings(data);
    } catch (error) {
      console.error("LOAD BOOKINGS ERROR:", error);
      alert("Gagal mengambil data booking.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (
    booking: Booking,
    status: BookingStatus
  ) => {
    try {
      setUpdatingId(booking.id);

      await updateBookingStatus(
        booking.id,
        status,
        booking.userId ?? null
      );

      await loadBookings();

      alert(`Booking berhasil diubah menjadi ${status}.`);
    } catch (error) {
      console.error("UPDATE BOOKING ERROR:", error);
      alert("Gagal mengubah status booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateProject = async (booking: Booking) => {
    try {
      setUpdatingId(booking.id);

      await createProjectFromBooking({
      bookingId: booking.id,
      userId: booking.userId ?? null,
      clientName: booking.name,
      clientEmail: booking.email,
      clientPhone: booking.whatsapp,
      whatsapp: booking.whatsapp,
      service: booking.service,
      packageType: booking.packageType,
      location: booking.location,
      amount: booking.amount,
    });

      await updateBookingStatus(
        booking.id,
        "completed",
        booking.userId ?? null
      );

      await loadBookings();

      alert("Project berhasil dibuat.");
    } catch (error) {
      console.error("CREATE PROJECT ERROR:", error);
      alert("Gagal membuat project.");
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

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Bookings</span>
          <h1>Manage Bookings</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadBookings}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-search">
            <i className="bi bi-search"></i>
            <input placeholder="Search booking..." />
          </div>

          <select>
            <option>All Status</option>
            <option>pending</option>
            <option>approved</option>
            <option>completed</option>
            <option>rejected</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Service</th>
                <th>Package</th>
                <th>Location</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9}>Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={9}>Belum ada booking masuk.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>#{booking.id.slice(0, 8)}</strong>
                    </td>

                    <td>
                      <div>
                        <strong>{booking.name}</strong>
                        <br />
                        <small>{booking.email}</small>
                      </div>
                    </td>

                    <td>{booking.service}</td>
                    <td>{booking.packageType}</td>
                    <td>{booking.location}</td>
                    <td>{formatDate(booking.createdAt)}</td>
                    <td>{formatCurrency(booking.amount)}</td>

                    <td>
                      <span className={`admin-status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>

                    <td className="text-end">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="btn btn-light btn-sm me-2"
                      >
                        View
                      </Link>

                      {booking.status === "pending" && (
                        <>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleUpdateStatus(booking, "approved")
                            }
                          >
                            {updatingId === booking.id
                              ? "Updating..."
                              : "Approve"}
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleUpdateStatus(booking, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {booking.status === "approved" && (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          disabled={updatingId === booking.id}
                          onClick={() => handleCreateProject(booking)}
                        >
                          {updatingId === booking.id
                            ? "Creating..."
                            : "Create Project"}
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