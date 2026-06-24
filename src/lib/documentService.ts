import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export type DocumentPayload = {
  userId?: string | null;
  projectId?: string | null;
  clientName: string;
  clientEmail: string;
  title: string;
  projectName: string;
  fileType: string;
  fileUrl: string;
  visibility: "client" | "admin-only";
};

export async function createDocument(data: DocumentPayload) {
  const docRef = await addDoc(collection(db, "documents"), {
    userId: data.userId ?? null,
    projectId: data.projectId ?? null,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    title: data.title,
    projectName: data.projectName,
    fileType: data.fileType,
    fileUrl: data.fileUrl,
    visibility: data.visibility,
    status: "available",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateDocumentStatus(
  documentId: string,
  status: "available" | "restricted"
) {
  const documentRef = doc(db, "documents", documentId);

  await updateDoc(documentRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(documentId: string) {
  const documentRef = doc(db, "documents", documentId);

  await deleteDoc(documentRef);
}