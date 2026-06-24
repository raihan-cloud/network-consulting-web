import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export type ContactPayload = {
  name: string;
  whatsapp: string;
  email: string;
  serviceType: string;
  subject: string;
  message: string;
};

export async function createContactMessage(
  data: ContactPayload
) {
  const docRef = await addDoc(
    collection(db, "contacts"),
    {
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      serviceType: data.serviceType,
      subject: data.subject,
      message: data.message,
      status: "new",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function updateContactStatus(
  contactId: string,
  status: "new" | "contacted" | "closed"
) {
  const contactRef = doc(
    db,
    "contacts",
    contactId
  );

  await updateDoc(contactRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteContact(
  contactId: string
) {
  const contactRef = doc(
    db,
    "contacts",
    contactId
  );

  await deleteDoc(contactRef);
}