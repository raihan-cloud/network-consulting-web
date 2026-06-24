"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { updateBookingStatus } from "@/lib/bookingService";

type BookingStatus =
  | "pending"
  | "approved"
  | "completed"
  | "rejected";

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
  notes?: string;
  createdAt?: any;
};

export default function AdminBookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function loadBooking() {
    try {
      setLoading(true);

      const bookingRef = doc(db, "bookings", bookingId);
      const bookingSnap = await getDoc(bookingRef);

      if (!bookingSnap.exists()) {
        setBooking(null);
        return;
      }

      setBooking({
        id: bookingSnap.id,
        ...bookingSnap.data(),
      } as Booking);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat booking.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const handleStatusUpdate = async (
  status: BookingStatus
) => {
  if (!booking) return;

  try {
    setUpdating(true);

    await updateBookingStatus(
      booking.id,
      status,
      booking.userId ?? null
    );

    await loadBooking();

    alert(`Booking berhasil diubah ke ${status}`);
  } catch (error) {
    console.error("UPDATE BOOKING ERROR:", error);
    alert("Gagal update status.");
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

    return new Date(
      timestamp.seconds * 1000
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="admin-content">
        Loading booking...
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="admin-content">
        Booking tidak ditemukan.
      </section>
    );
  }

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Booking Detail</span>
          <h1>{booking.service}</h1>
        </div>

        <Link
          href="/admin/bookings"
          className="btn btn-light"
        >
          Back
        </Link>
      </div>

      <div className="project-detail-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Client Information</span>
              <h2>Booking Overview</h2>
            </div>
          </div>

          <div className="project-detail-info">
            <div>
              <span>Client</span>
              <strong>{booking.name}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{booking.email}</strong>
            </div>

            <div>
              <span>WhatsApp</span>
              <strong>{booking.whatsapp}</strong>
            </div>

            <div>
              <span>Service</span>
              <strong>{booking.service}</strong>
            </div>

            <div>
              <span>Package</span>
              <strong>{booking.packageType}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{booking.location}</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>
                {formatCurrency(booking.amount)}
              </strong>
            </div>

            <div>
              <span>Created</span>
              <strong>
                {formatDate(booking.createdAt)}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{booking.status}</strong>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Actions</span>
              <h2>Booking Management</h2>
            </div>
          </div>

          <div className="admin-invoice-actions">
            <button
              className="btn btn-warning w-100"
              disabled={updating}
              onClick={() =>
                handleStatusUpdate("approved")
              }
            >
              Approve Booking
            </button>

            <button
              className="btn btn-outline-danger w-100"
              disabled={updating}
              onClick={() =>
                handleStatusUpdate("rejected")
              }
            >
              Reject Booking
            </button>

            <button
              className="btn btn-outline-success w-100"
              disabled={updating}
              onClick={() =>
                handleStatusUpdate("completed")
              }
            >
              Mark Completed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}