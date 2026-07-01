"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

type ProjectPhoto = {
  url: string;
  publicId?: string;
  name?: string;
};

type Project = {
  id: string;
  userId?: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  whatsapp?: string;
  name: string;
  packageType: string;
  location: string;
  amount: number;
  status: string;
  progress: number;
  engineer: string;
  progressStage?: string;
  lastUpdate?: string;
  createdAt?: any;
  updatedAt?: any;
};

type ProjectLog = {
  id: string;
  projectId: string;
  type: string;
  title: string;
  description: string;
  progress?: number | null;
  engineer?: string;
  photos?: ProjectPhoto[];
  photoUrls?: string[];
  photoCount?: number;
  createdAt?: any;
};

function formatDate(timestamp: any) {
  if (!timestamp?.seconds) return "-";

  return new Date(timestamp.seconds * 1000).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status: string) {
  if (status === "planning") return "Planning";
  if (status === "implementation") return "Implementation";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return status;
}

export default function ClientProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProject() {
    try {
      setLoading(true);

      const projectRef = doc(db, "projects", projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        setProject(null);
        return;
      }

      const data = {
        id: projectSnap.id,
        ...projectSnap.data(),
      } as Project;

      if (user?.uid && data.userId && data.userId !== user.uid) {
        setProject(null);
        return;
      }

      setProject(data);

      const logsQuery = query(
        collection(db, "project_logs"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc")
      );

      const logsSnap = await getDocs(logsQuery);

      const logsData = logsSnap.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as ProjectLog[];

      setLogs(logsData);
    } catch (error) {
      console.error("LOAD CLIENT PROJECT ERROR:", error);
      alert("Gagal memuat detail project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId, user?.uid]);

  if (loading) {
    return (
      <main className="client-project-page">
        <div className="container">
          <div className="admin-table-card">Loading project...</div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="client-project-page">
        <div className="container">
          <div className="admin-table-card">Project tidak ditemukan.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="client-project-page">
      <div className="container">
        <div className="client-project-header">
          <div>
            <span className="cf-eyebrow">PROJECT MONITORING</span>
            <h1>{project.name}</h1>
            <p>
              Pantau progress pekerjaan, catatan engineer, dan dokumentasi foto
              project Anda secara transparan.
            </p>
          </div>

          <Link href="/dashboard" className="btn btn-light">
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </Link>
        </div>

          <Link href={`/dashboard/projects/${project.id}/report`} className="btn btn-warning">
            <i className="bi bi-file-earmark-text me-2"></i>
            Completion Report
          </Link>
        <section className="client-project-hero">
          <div>
            <span className={`client-project-status ${project.status}`}>
              {getStatusLabel(project.status)}
            </span>

            <h2>{project.progress || 0}% Complete</h2>
            <p>{project.lastUpdate || "Project sedang diproses oleh tim NetPro."}</p>
          </div>

          <div className="client-project-progress-ring">
            <strong>{project.progress || 0}%</strong>
            <span>Progress</span>
          </div>
        </section>

        <div className="client-project-progress-bar">
          <div style={{ width: `${project.progress || 0}%` }}></div>
        </div>

        <section className="client-project-summary-grid">
          <div>
            <span>Current Stage</span>
            <strong>{project.progressStage || "Planning"}</strong>
          </div>

          <div>
            <span>Engineer</span>
            <strong>{project.engineer || "-"}</strong>
          </div>

          <div>
            <span>Location</span>
            <strong>{project.location}</strong>
          </div>

          <div>
            <span>Package</span>
            <strong>{project.packageType}</strong>
          </div>
        </section>

        <section className="client-project-layout">
          <div className="client-project-panel">
            <div className="client-project-panel-header">
              <span>Timeline</span>
              <h2>Progress Updates</h2>
            </div>

            <div className="client-project-timeline">
              {logs.length === 0 ? (
                <p>Belum ada update progress.</p>
              ) : (
                logs.map((log) => (
                  <article className="client-project-log" key={log.id}>
                    <div className="client-project-log-point">
                      {typeof log.progress === "number" ? `${log.progress}%` : "•"}
                    </div>

                    <div>
                      <small>{formatDate(log.createdAt)}</small>
                      <h3>{log.title}</h3>
                      <p>{log.description}</p>

                      {log.engineer && (
                        <span>
                          <i className="bi bi-person-badge me-2"></i>
                          {log.engineer}
                        </span>
                      )}

                      {log.photos && log.photos.length > 0 && (
                        <div className="client-project-gallery">
                          {log.photos.map((photo, index) => (
                            <a
                              href={photo.url}
                              target="_blank"
                              rel="noreferrer"
                              key={photo.publicId || `${photo.url}-${index}`}
                            >
                              <img
                                src={photo.url}
                                alt={photo.name || "Foto progress project"}
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="client-project-panel">
            <div className="client-project-panel-header">
              <span>Project Info</span>
              <h2>Detail</h2>
            </div>

            <div className="client-project-info-list">
              <div>
                <span>Client</span>
                <strong>{project.clientName}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{project.clientEmail}</strong>
              </div>

              <div>
                <span>WhatsApp</span>
                <strong>{project.clientPhone || project.whatsapp || "-"}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{getStatusLabel(project.status)}</strong>
              </div>

              <div>
                <span>Created</span>
                <strong>{formatDate(project.createdAt)}</strong>
              </div>
            </div>

            <div className="client-project-help">
              <i className="bi bi-info-circle"></i>
              <p>
                Setiap progress penting akan dikirim ke WhatsApp dan tersimpan
                sebagai timeline project lengkap dengan dokumentasi foto.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}