"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

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
  status: string;
  paymentStatus?: string | null;
  paymentMethod?: string | null;
  paymentUrl?: string | null;
  snapToken?: string | null;
  dueDate: string;
  createdAt?: any;
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const { user } = useAuth();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  async function loadInvoice() {
    if (!user) return;

    try {
      setLoading(true);

      const invoiceRef = doc(db, "invoices", invoiceId);
      const invoiceSnap = await getDoc(invoiceRef);

      if (!invoiceSnap.exists()) {
        setInvoice(null);
        return;
      }

      const data = {
        id: invoiceSnap.id,
        ...invoiceSnap.data(),
      } as Invoice;

      if (data.userId !== user.uid) {
        alert("Anda tidak memiliki akses.");
        setInvoice(null);
        return;
      }

      setInvoice(data);
    } catch (error) {
      console.error("LOAD INVOICE ERROR:", error);
      alert("Gagal memuat invoice.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (invoiceId && user) {
      loadInvoice();
    }
  }, [invoiceId, user]);

  const handlePayNow = async () => {
    if (!invoice) return;

    try {
      setPaying(true);

      const response = await fetch("/api/midtrans/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        invoiceId: invoice.id,
        amount: Number(invoice.amount),
        name: invoice.clientName,
        email: invoice.clientEmail,
        projectName: invoice.projectName,
      }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result);
        alert(result.error || result.message || "Gagal membuat transaksi.");
        return;
      }

      if (!result.token) {
        alert("Snap token tidak ditemukan.");
        return;
      }

      if (!window.snap) {
        alert("Midtrans Snap belum siap. Coba refresh halaman.");
        return;
      }

      window.snap.pay(result.token, {
        onSuccess: async () => {
          const invoiceRef = doc(db, "invoices", invoice.id);

          await updateDoc(invoiceRef, {
            status: "paid",
            paymentStatus: "paid",
            paymentMethod: "midtrans",
            paidAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          alert("Pembayaran berhasil.");
          await loadInvoice();
        },

        onPending: async () => {
          const invoiceRef = doc(db, "invoices", invoice.id);

          await updateDoc(invoiceRef, {
            status: "unpaid",
            paymentStatus: "pending",
            paymentMethod: "midtrans",
            updatedAt: serverTimestamp(),
          });

          alert("Pembayaran masih pending.");
          await loadInvoice();
        },

        onError: async () => {
          const invoiceRef = doc(db, "invoices", invoice.id);

          await updateDoc(invoiceRef, {
            paymentStatus: "failed",
            paymentMethod: "midtrans",
            updatedAt: serverTimestamp(),
          });

          alert("Pembayaran gagal.");
          await loadInvoice();
        },

        onClose: () => {
          alert("Popup pembayaran ditutup.");
        },
      });
    } catch (error) {
      console.error("PAY NOW ERROR:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setPaying(false);
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

    return new Date(timestamp.seconds * 1000).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="client-dashboard-content">
        <div className="client-empty-state">
          <h3>Loading invoice...</h3>
        </div>
      </section>
    );
  }

  if (!invoice) {
    return (
      <section className="client-dashboard-content">
        <div className="client-empty-state">
          <h3>Invoice tidak ditemukan</h3>

          <Link href="/dashboard/invoices" className="btn btn-warning">
            Kembali
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <section className="client-dashboard-content">
        <div className="client-page-header">
          <div>
            <span>Invoice Detail</span>
            <h1>{invoice.title}</h1>
          </div>

          <Link href="/dashboard/invoices" className="btn btn-light">
            Back
          </Link>
        </div>

        <div className="client-panel">
          <div className="invoice-detail-grid">
            <div>
              <span>Invoice ID</span>
              <strong>#{invoice.id.slice(0, 8)}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{invoice.status}</strong>
            </div>

            <div>
              <span>Payment Status</span>
              <strong>{invoice.paymentStatus || "waiting"}</strong>
            </div>

            <div>
              <span>Payment Method</span>
              <strong>{invoice.paymentMethod || "-"}</strong>
            </div>

            <div>
              <span>Project</span>
              <strong>{invoice.projectName}</strong>
            </div>

            <div>
              <span>Client</span>
              <strong>{invoice.clientName}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{invoice.clientEmail}</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>{formatCurrency(invoice.amount)}</strong>
            </div>

            <div>
              <span>Issued Date</span>
              <strong>{formatDate(invoice.createdAt)}</strong>
            </div>

            <div>
              <span>Due Date</span>
              <strong>{invoice.dueDate}</strong>
            </div>
          </div>

          <div className="invoice-total-card">
            <span>Total Payment</span>

            <h2>{formatCurrency(invoice.amount)}</h2>

            {invoice.status !== "paid" ? (
              <button
                className="btn btn-warning btn-lg"
                disabled={paying}
                onClick={handlePayNow}
              >
                <i className="bi bi-wallet2 me-2"></i>
                {paying ? "Processing..." : "Pay Now"}
              </button>
            ) : (
              <button className="btn btn-success btn-lg" disabled>
                <i className="bi bi-check-circle me-2"></i>
                Paid
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}