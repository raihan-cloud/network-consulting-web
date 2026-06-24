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
import {
  ProjectStatus,
  updateProjectEngineer,
  updateProjectProgress,
  updateProjectStatus,
} from "@/lib/projectService";

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
  status: ProjectStatus;
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

export default function AdminProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [progress, setProgress] = useState(0);
  const [engineer, setEngineer] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planning");

  async function loadProjectDetail() {
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

      setProject(projectData);
      setProgress(projectData.progress || 0);
      setEngineer(projectData.engineer || "");
      setStatus(projectData.status || "planning");

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
      console.error("LOAD PROJECT DETAIL ERROR:", error);
      alert("Gagal memuat detail project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId) {
      loadProjectDetail();
    }
  }, [projectId]);

  const handleUpdateProgress = async () => {
    if (progress < 0 || progress > 100) {
      alert("Progress harus antara 0 sampai 100.");
      return;
    }

    try {
      setUpdating(true);

     const handleUpdateProgress = async () => {
  if (!project) return;

  await updateProjectProgress(
    projectId,
    progress,
    project.userId ?? null
  );
};
      await loadProjectDetail();

      alert("Progress berhasil diperbarui.");
    } catch (error) {
      console.error("UPDATE PROJECT PROGRESS ERROR:", error);
      alert("Gagal memperbarui progress.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateEngineer = async () => {
    if (!engineer.trim()) {
      alert("Nama engineer tidak boleh kosong.");
      return;
    }

    try {
      setUpdating(true);

    const handleUpdateEngineer = async () => {
  if (!project) return;

  await updateProjectEngineer(
    projectId,
    engineer,
    project.userId ?? null
  );
};
      await loadProjectDetail();

      alert("Engineer berhasil diperbarui.");
    } catch (error) {
      console.error("UPDATE PROJECT ENGINEER ERROR:", error);
      alert("Gagal memperbarui engineer.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);

      const handleUpdateStatus = async (
  status: ProjectStatus
) => {
  if (!project) return;

  await updateProjectStatus(
    projectId,
    status,
    project.userId ?? null
  );
};
      await loadProjectDetail();

      alert("Status project berhasil diperbarui.");
    } catch (error) {
      console.error("UPDATE PROJECT STATUS ERROR:", error);
      alert("Gagal memperbarui status project.");
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "-";

    return new Date(timestamp.seconds * 1000).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="admin-content">
        <div className="admin-table-card">Loading project detail...</div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="admin-content">
        <div className="admin-table-card">Project tidak ditemukan.</div>
      </section>
    );
  }

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Project Detail</span>
          <h1>{project.name}</h1>
        </div>

        <Link href="/admin/projects" className="btn btn-light">
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </Link>
      </div>

      <div className="project-detail-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Project Information</span>
              <h2>Overview</h2>
            </div>
          </div>

          <div className="project-detail-info">
            <div>
              <span>Client</span>
              <strong>{project.clientName}</strong>
              <small>{project.clientEmail}</small>
            </div>

            <div>
              <span>Status</span>
              <strong>{project.status}</strong>
            </div>

            <div>
              <span>Progress</span>
              <strong>{project.progress || 0}%</strong>
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
              <span>Project Value</span>
              <strong>{formatCurrency(project.amount)}</strong>
            </div>

            <div>
              <span>Created</span>
              <strong>{formatDate(project.createdAt)}</strong>
            </div>
          </div>

          <div className="admin-progress mt-4">
            <div style={{ width: `${project.progress || 0}%` }}></div>
          </div>

          <div className="admin-project-detail-actions mt-4">
            <div>
              <label className="form-label">Progress</label>
              <input
                type="number"
                min={0}
                max={100}
                className="form-control"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
              />
              <button
                className="btn btn-outline-primary mt-2 w-100"
                disabled={updating}
                onClick={handleUpdateProgress}
              >
                Update Progress
              </button>
            </div>

            <div>
              <label className="form-label">Engineer</label>
              <input
                className="form-control"
                value={engineer}
                onChange={(e) => setEngineer(e.target.value)}
                placeholder="Nama engineer"
              />
              <button
                className="btn btn-outline-primary mt-2 w-100"
                disabled={updating}
                onClick={handleUpdateEngineer}
              >
                Update Engineer
              </button>
            </div>

            <div>
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              >
                <option value="planning">Planning</option>
                <option value="implementation">Implementation</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                className="btn btn-warning mt-2 w-100"
                disabled={updating}
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Timeline</span>
              <h2>Project Logs</h2>
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
      </div>
    </section>
  );
}