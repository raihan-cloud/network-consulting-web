import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export type NotificationType =
  | "booking"
  | "ticket"
  | "contact"
  | "invoice"
  | "project"
  | "document";

export type NotificationPayload = {
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string | null;
  referencePath?: string | null;
  targetUserId?: string | null;
  targetRole?: "admin" | "client";
};

export async function createNotification(data: NotificationPayload) {
  const docRef = await addDoc(collection(db, "notifications"), {
    type: data.type,
    title: data.title,
    message: data.message,
    referenceId: data.referenceId ?? null,
    referencePath: data.referencePath ?? null,
    targetUserId: data.targetUserId ?? null,
    targetRole: data.targetRole ?? "admin",
    isRead: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function markNotificationAsRead(notificationId: string) {
  const notificationRef = doc(db, "notifications", notificationId);

  await updateDoc(notificationRef, {
    isRead: true,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteNotification(notificationId: string) {
  const notificationRef = doc(db, "notifications", notificationId);

  await deleteDoc(notificationRef);
}