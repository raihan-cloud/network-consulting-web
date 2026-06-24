import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function registerClient({
  name,
  email,
  whatsapp,
  password,
}: {
  name: string;
  email: string;
  whatsapp: string;
  password: string;
}) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    whatsapp,
    role: "client",
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    throw new Error("User data tidak ditemukan di Firestore.");
  }

  return {
    user,
    profile: userDoc.data(),
  };
}

export async function logoutUser() {
  await signOut(auth);
}