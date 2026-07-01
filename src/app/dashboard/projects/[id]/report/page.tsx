"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  title: string;
  description: string;
  progress?: number | null;
  engineer?: string;
  photos?: ProjectPhoto[];
  createdAt?: any;
};

function formatDate(timestamp: any) {
  if (!timestamp?.seconds) return "-";

  return new Date(timestamp.seconds * 1000).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ProjectCompletionReportPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [loading, setLoading] = useState(true);

  const allPhotos = useMemo(() => {
    return logs.flatMap((log) => log.photos || []);
  }, [logs]);

  async function loadReport() {
    try {
      setLoading(true);

      const projectSnap = await getDoc(doc(db, "projects", projectId));

      if (!projectSnap.exists()) {
        setProject(null);
        return;
      }

      const projectData = {
        id: projectSnap.id,
        ...projectSnap.data(),
      } as Project;

      if (user?.uid && projectData.userId && projectData.userId !== user.uid) {
        setProject(null);
        return;
      }

      setProject(projectData);

      const logsQuery = query(
        collection(db, "project_logs"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "asc")
      );

      const logsSnap = await getDocs(logsQuery);

      const logData = logsSnap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as ProjectLog[];

      setLogs(logData);
    } catch (error) {
      console.error("LOAD REPORT ERROR:", error);
      alert("Gagal memuat laporan project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId) loadReport();
  }, [projectId, user?.uid]);

  if (loading) {
    return (
      <main className="completion-report-page">
        <div className="container">
          <div className="admin-table-card">Loading report...</div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="completion-report-page">
        <div className="container">
          <div className="admin-table-card">Report tidak ditemukan.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="completion-report-page">
      <div className="container">
        <div className="report-header">
          <div>
            <span className="cf-eyebrow">PROJECT COMPLETION REPORT</span>
            <h1>{project.name}</h1>
            <p>
              Laporan penyelesaian project berisi progress, timeline pekerjaan,
              catatan engineer, dan dokumentasi foto.
            </p>
          </div>

          <Link href={`/dashboard/projects/${project.id}`} className="btn btn-light">
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Link>
        </div>

        <section className="report-hero">
          <div>
            <span className={`report-status ${project.status}`}>
              {project.status === "completed" ? "Completed" : project.status}
            </span>

            <h2>{project.progress || 0}% Project Progress</h2>
            <p>{project.lastUpdate || "Project sedang berjalan."}</p>
          </div>

          <div className="report-progress-badge">
            <strong>{project.progress || 0}%</strong>
            <span>Complete</span>
          </div>
        </section>

        <section className="report-summary-grid">
          <div>
            <span>Client</span>
            <strong>{project.clientName}</strong>
            <small>{project.clientEmail}</small>
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

          <div>
            <span>Current Stage</span>
            <strong>{project.progressStage || "-"}</strong>
          </div>

          <div>
            <span>Created</span>
            <strong>{formatDate(project.createdAt)}</strong>
          </div>
        </section>

        <section className="report-section">
          <div className="report-section-header">
            <span>Timeline</span>
            <h2>Progress History</h2>
          </div>

          <div className="report-timeline">
            {logs.length === 0 ? (
              <p>Belum ada timeline project.</p>
            ) : (
              logs.map((log) => (
                <article className="report-timeline-item" key={log.id}>
                  <div className="report-timeline-percent">
                    {typeof log.progress === "number" ? `${log.progress}%` : "•"}
                  </div>

                  <div>
                    <small>{formatDate(log.createdAt)}</small>
                    <h3>{log.title}</h3>
                    <p>{log.description}</p>

                    {log.photos && log.photos.length > 0 && (
                      <div className="report-photo-grid">
                        {log.photos.map((photo, index) => (
                          <a
                            href={photo.url}
                            target="_blank"
                            rel="noreferrer"
                            key={photo.publicId || `${photo.url}-${index}`}
                          >
                            <img src={photo.url} alt={photo.name || "Project photo"} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="report-section">
          <div className="report-section-header">
            <span>Documentation</span>
            <h2>Project Photos</h2>
          </div>

          {allPhotos.length === 0 ? (
            <div className="report-empty-box">
              Belum ada dokumentasi foto.
            </div>
          ) : (
            <div className="report-gallery">
              {allPhotos.map((photo, index) => (
                <a
                  href={photo.url}
                  target="_blank"
                  rel="noreferrer"
                  key={photo.publicId || `${photo.url}-${index}`}
                >
                  <img src={photo.url} alt={photo.name || "Project documentation"} />
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}