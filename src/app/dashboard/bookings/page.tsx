"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

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
  createdAt?: any;
};

export default function DashboardBookingsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  async function loadBookings() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Booking[];

      setBookings(data);
    } catch (error) {
      console.error("LOAD CLIENT BOOKINGS ERROR:", error);
      alert("Gagal mengambil data booking.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [user]);

  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return "Gratis";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
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
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Bookings</span>
          <h1>My Bookings</h1>
        </div>

        <Link href="/booking" className="btn btn-warning">
          New Booking
        </Link>
      </div>

      {loading ? (
        <div className="client-empty-state">
          <h3>Loading...</h3>
        </div>
      ) : bookings.length === 0 ? (
        <div className="client-empty-state">
          <i className="bi bi-calendar-x"></i>

          <h3>Belum ada booking</h3>

          <p>Anda belum memiliki booking layanan.</p>

          <Link href="/booking" className="btn btn-warning">
            Buat Booking Pertama
          </Link>
        </div>
      ) : (
        <div className="client-bookings-list">
          {bookings.map((booking) => (
            <div className="client-booking-card" key={booking.id}>
              <div className="client-booking-main">
                <div>
                  <small>#{booking.id.slice(0, 8)}</small>

                  <h3>{booking.service}</h3>

                  <p>{booking.packageType}</p>
                </div>

                <span className={`booking-status ${booking.status}`}>
                  {booking.status}
                </span>
              </div>

              <div className="client-booking-meta">
                <div>
                  <span>Tanggal</span>
                  <strong>{formatDate(booking.createdAt)}</strong>
                </div>

                <div>
                  <span>Lokasi</span>
                  <strong>{booking.location}</strong>
                </div>

                <div>
                  <span>Nilai Booking</span>
                  <strong>{formatCurrency(booking.amount)}</strong>
                </div>
              </div>

              <div className="client-booking-footer">
                <Link href="/contact" className="btn btn-light">
                  Contact Support
                </Link>

                <button className="btn btn-outline-primary">
                  View Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}