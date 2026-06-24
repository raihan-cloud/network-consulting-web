import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export type ProjectLogType =
  | "created"
  | "progress"
  | "engineer"
  | "status"
  | "document"
  | "invoice";

export type ProjectLogPayload = {
  projectId: string;
  type: ProjectLogType;
  title: string;
  description: string;
  progress?: number;
};

export async function createProjectLog(data: ProjectLogPayload) {
  const docRef = await addDoc(collection(db, "project_logs"), {
    projectId: data.projectId,
    type: data.type,
    title: data.title,
    description: data.description,
    progress: data.progress ?? null,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}