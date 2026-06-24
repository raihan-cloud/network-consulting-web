import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

export type TicketStatus =
  | "open"
  | "in-progress"
  | "resolved"
  | "closed";

export type TicketPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type TicketPayload = {
  userId?: string | null;
  clientName: string;
  clientEmail: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  description: string;
};

export async function createTicket(data: TicketPayload) {
  const docRef = await addDoc(collection(db, "tickets"), {
    userId: data.userId ?? null,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    subject: data.subject,
    category: data.category,
    priority: data.priority,
    description: data.description,
    status: "open",
    adminReply: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
) {
  const ticketRef = doc(db, "tickets", ticketId);

  await updateDoc(ticketRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function replyTicket(
  ticketId: string,
  adminReply: string
) {
  const ticketRef = doc(db, "tickets", ticketId);

  await updateDoc(ticketRef, {
    adminReply,
    status: "in-progress",
    updatedAt: serverTimestamp(),
  });
}