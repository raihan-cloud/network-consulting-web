import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

export type InvoiceStatus =
  | "unpaid"
  | "paid"
  | "overdue"
  | "cancelled";

export type PaymentStatus =
  | "waiting"
  | "pending"
  | "paid"
  | "failed"
  | "expired";

export type InvoicePayload = {
  projectId: string;
  bookingId?: string;
  userId?: string | null;
  clientName: string;
  clientEmail: string;
  projectName: string;
  title: string;
  amount: number;
  dueDate: string;
};

export async function createInvoice(
  data: InvoicePayload
) {
  const docRef = await addDoc(
    collection(db, "invoices"),
    {
      projectId: data.projectId,
      bookingId: data.bookingId || null,
      userId: data.userId ?? null,

      clientName: data.clientName,
      clientEmail: data.clientEmail,

      projectName: data.projectName,
      title: data.title,

      amount: data.amount,

      status: "unpaid",

      paymentStatus: "waiting",
      paymentMethod: null,
      paymentUrl: null,
      paidAt: null,

      dueDate: data.dueDate,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
) {
  const invoiceRef = doc(
    db,
    "invoices",
    invoiceId
  );

  await updateDoc(invoiceRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updateInvoicePayment(
  invoiceId: string,
  data: {
    paymentStatus: PaymentStatus;
    paymentMethod?: string | null;
    paymentUrl?: string | null;
    paidAt?: Date | null;
  }
) {
  const invoiceRef = doc(
    db,
    "invoices",
    invoiceId
  );

  await updateDoc(invoiceRef, {
    paymentStatus: data.paymentStatus,
    paymentMethod:
      data.paymentMethod ?? null,
    paymentUrl:
      data.paymentUrl ?? null,
    paidAt: data.paidAt ?? null,
    updatedAt: serverTimestamp(),
  });
}