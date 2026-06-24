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

type Project = {
  id: string;
  bookingId?: string;
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
  createdAt?: any;
};

export default function DashboardProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProjectDetail() {
    if (!user) return;

    try {
      setLoading(true);

      const projectRef = doc(db, "projects", projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        setProject(null);
        return;
      }

      const projectData = {
        id: projectSnap.id,
        ...projectSnap.data(),
      } as Project;

      if (projectData.userId !== user.uid) {
        alert("Anda tidak memiliki akses ke project ini.");
        setProject(null);
        return;
      }

      setProject(projectData);

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
      console.error("LOAD CLIENT PROJECT DETAIL ERROR:", error);
      alert("Gagal memuat detail project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId && user) {
      loadProjectDetail();
    }
  }, [projectId, user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "-";

    return new Date(timestamp.seconds * 1000).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <section className="client-dashboard-content">
        <div className="client-empty-state">
          <h3>Loading project detail...</h3>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="client-dashboard-content">
        <div className="client-empty-state">
          <i className="bi bi-kanban"></i>
          <h3>Project tidak ditemukan</h3>
          <p>Project tidak tersedia atau bukan milik akun Anda.</p>

          <Link href="/dashboard/projects" className="btn btn-warning">
            Kembali ke Projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Project Detail</span>
          <h1>{project.name}</h1>
        </div>

        <Link href="/dashboard/projects" className="btn btn-light">
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </Link>
      </div>

      <div className="client-project-detail-grid">
        <div className="client-project-detail-main">
          <div className="client-project-card">
            <div className="client-project-top">
              <div>
                <small>#{project.id.slice(0, 8)}</small>
                <h3>{project.name}</h3>
                <p>{project.packageType}</p>
              </div>

              <span className="project-status info">
                {project.status}
              </span>
            </div>

            <div className="client-project-meta">
              <div>
                <span>Location</span>
                <strong>{project.location}</strong>
              </div>

              <div>
                <span>Engineer</span>
                <strong>{project.engineer || "-"}</strong>
              </div>

              <div>
                <span>Project Value</span>
                <strong>{formatCurrency(project.amount)}</strong>
              </div>
            </div>

            <div className="client-project-meta mt-3">
              <div>
                <span>Progress</span>
                <strong>{project.progress || 0}%</strong>
              </div>

              <div>
                <span>Created</span>
                <strong>{formatDate(project.createdAt)}</strong>
              </div>

              <div>
                <span>Updated</span>
                <strong>{formatDate(project.updatedAt)}</strong>
              </div>
            </div>

            <div className="client-progress mt-4">
              <div style={{ width: `${project.progress || 0}%` }}></div>
            </div>
          </div>
        </div>

        <aside className="client-project-detail-side">
          <div className="client-panel">
            <div className="client-panel-header">
              <div>
                <span>Timeline</span>
                <h2>Project Updates</h2>
              </div>
            </div>

            <div className="project-log-list">
              {logs.length === 0 ? (
                <p>Belum ada timeline project.</p>
              ) : (
                logs.map((log) => (
                  <div className="project-log-item" key={log.id}>
                    <div className="project-log-dot"></div>

                    <div>
                      <small>{formatDate(log.createdAt)}</small>
                      <h4>{log.title}</h4>
                      <p>{log.description}</p>

                      {typeof log.progress === "number" && (
                        <strong>{log.progress}%</strong>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}   