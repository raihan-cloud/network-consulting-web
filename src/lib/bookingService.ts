import { db } from "@/lib/firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

import { createNotification } from "@/lib/notificationService";

export type BookingStatus =
  | "pending"
  | "approved"
  | "completed"
  | "rejected";

export type BookingPayload = {
  userId?: string | null;
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  service: string;
  packageType: string;
  location: string;
  budget: string;
  description: string;
  amount: number;
  status: "pending";
};

export async function createBooking(data: BookingPayload) {
  const bookingData = {
    userId: data.userId ?? null,
    name: data.name,
    email: data.email,
    whatsapp: data.whatsapp,
    company: data.company || "-",
    service: data.service,
    packageType: data.packageType,
    location: data.location,
    budget: data.budget,
    description: data.description || "-",
    amount: data.amount,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, "bookings"),
    bookingData
  );

  await createNotification({
    type: "booking",
    title: "Booking Baru",
    message: `${data.name} membuat booking ${data.service} - ${data.packageType}.`,
    referenceId: docRef.id,
    referencePath: `/admin/bookings/${docRef.id}`,
  });

  return docRef.id;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  userId?: string | null
) {
  const bookingRef = doc(db, "bookings", bookingId);

  await updateDoc(bookingRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  const statusMessage: Record<BookingStatus, string> = {
    pending: "Booking sedang menunggu review admin.",
    approved: "Booking Anda telah disetujui dan siap diproses.",
    completed: "Booking telah selesai diproses.",
    rejected: "Booking Anda ditolak. Silakan hubungi admin.",
  };

  // Notifikasi Admin
  await createNotification({
    type: "booking",
    title: "Status Booking Diperbarui",
    message: `Booking #${bookingId.slice(0, 8)} berubah menjadi ${status}.`,
    referenceId: bookingId,
    referencePath: `/admin/bookings/${bookingId}`,
    targetRole: "admin",
  });

  // Notifikasi Client
  if (userId) {
  await createNotification({
    type: "booking",
    title: "Update Booking",
    message: statusMessage[status],
    referenceId: bookingId,
    referencePath: `/dashboard/bookings/${bookingId}`,
    targetRole: "client",
    targetUserId: userId,
  });
  }
}