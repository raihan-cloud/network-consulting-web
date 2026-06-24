import { db } from "@/lib/firebase";
import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export type UserRole = "client" | "admin";

export async function updateUserRole(
  userId: string,
  role: UserRole
) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    role,
    updatedAt: serverTimestamp(),
  });
}