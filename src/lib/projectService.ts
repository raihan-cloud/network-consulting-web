import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

import { createProjectLog } from "@/lib/projectLogService";
import { createNotification } from "@/lib/notificationService";

export type ProjectStatus =
  | "planning"
  | "implementation"
  | "completed"
  | "cancelled";

export type ProjectPayload = {
  bookingId: string;
  userId?: string | null;
  clientName: string;
  clientEmail: string;
  service: string;
  packageType: string;
  location: string;
  amount: number;
};

export async function createProjectFromBooking(data: ProjectPayload) {
  const docRef = await addDoc(collection(db, "projects"), {
    bookingId: data.bookingId,
    userId: data.userId ?? null,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    name: data.service,
    packageType: data.packageType,
    location: data.location,
    amount: data.amount,
    status: "planning",
    progress: 0,
    engineer: "-",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await createProjectLog({
    projectId: docRef.id,
    type: "created",
    title: "Project Created",
    description: `Project ${data.service} dibuat dari booking.`,
    progress: 0,
  });

  await createNotification({
    type: "project",
    title: "Project Baru Dibuat",
    message: `Project ${data.service} telah dibuat dan sedang masuk tahap planning.`,
    referenceId: docRef.id,
    referencePath: `/dashboard/projects/${docRef.id}`,
    targetRole: "client",
    targetUserId: data.userId ?? null,
  });

  await createNotification({
    type: "project",
    title: "Project Baru",
    message: `Project ${data.service} dibuat untuk ${data.clientName}.`,
    referenceId: docRef.id,
    referencePath: `/admin/projects/${docRef.id}`,
    targetRole: "admin",
  });

  return docRef.id;
}

export async function updateProjectProgress(
  projectId: string,
  progress: number,
  userId?: string | null
) {
  const projectRef = doc(db, "projects", projectId);

  const newStatus: ProjectStatus =
    progress >= 100
      ? "completed"
      : progress > 0
      ? "implementation"
      : "planning";

  await updateDoc(projectRef, {
    progress,
    status: newStatus,
    updatedAt: serverTimestamp(),
  });

  await createProjectLog({
    projectId,
    type: "progress",
    title: "Progress Updated",
    description: `Progress project diperbarui menjadi ${progress}%.`,
    progress,
  });

  if (userId) {
    await createNotification({
      type: "project",
      title: progress >= 100 ? "Project Completed" : "Progress Project Updated",
      message:
        progress >= 100
          ? "Project Anda telah selesai."
          : `Progress project Anda sekarang ${progress}%.`,
      referenceId: projectId,
      referencePath: `/dashboard/projects/${projectId}`,
      targetRole: "client",
      targetUserId: userId,
    });
  }
}

export async function updateProjectEngineer(
  projectId: string,
  engineer: string,
  userId?: string | null
) {
  const projectRef = doc(db, "projects", projectId);

  await updateDoc(projectRef, {
    engineer,
    updatedAt: serverTimestamp(),
  });

  await createProjectLog({
    projectId,
    type: "engineer",
    title: "Engineer Assigned",
    description: `Engineer project diperbarui menjadi ${engineer}.`,
  });

  if (userId) {
    await createNotification({
      type: "project",
      title: "Engineer Assigned",
      message: `${engineer} telah ditugaskan ke project Anda.`,
      referenceId: projectId,
      referencePath: `/dashboard/projects/${projectId}`,
      targetRole: "client",
      targetUserId: userId,
    });
  }
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
  userId?: string | null
) {
  const projectRef = doc(db, "projects", projectId);

  await updateDoc(projectRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  await createProjectLog({
    projectId,
    type: "status",
    title: "Status Updated",
    description: `Status project diperbarui menjadi ${status}.`,
  });

  if (userId) {
    await createNotification({
      type: "project",
      title: "Status Project Updated",
      message: `Status project Anda diperbarui menjadi ${status}.`,
      referenceId: projectId,
      referencePath: `/dashboard/projects/${projectId}`,
      targetRole: "client",
      targetUserId: userId,
    });
  }
}