"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { createInvoice } from "@/lib/invoiceService";
import {
  updateProjectEngineer,
  updateProjectProgress,
} from "@/lib/projectService";

type ProjectStatus =
  | "planning"
  | "implementation"
  | "completed"
  | "cancelled";

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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [creatingInvoice, setCreatingInvoice] =
    useState<string | null>(null);

  const [updatingProjectId, setUpdatingProjectId] =
    useState<string | null>(null);

  const [progressValues, setProgressValues] =
    useState<Record<string, number>>({});

  const [engineerValues, setEngineerValues] =
    useState<Record<string, string>>({});

  async function loadProjects() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "projects"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Project[];

      setProjects(data);

      const progressMap: Record<string, number> = {};
      const engineerMap: Record<string, string> = {};

      data.forEach((project) => {
        progressMap[project.id] = project.progress || 0;
        engineerMap[project.id] = project.engineer || "";
      });

      setProgressValues(progressMap);
      setEngineerValues(engineerMap);
    } catch (error) {
      console.error("LOAD PROJECTS ERROR:", error);
      alert("Gagal mengambil data project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const getStatusClass = (status: ProjectStatus) => {
    if (status === "completed") return "completed";
    if (status === "implementation") return "approved";
    if (status === "cancelled") return "rejected";
    return "pending";
  };

  const handleUpdateProgress = async (project: Project) => {
    const progress = Number(progressValues[project.id] || 0);

    if (progress < 0 || progress > 100) {
      alert("Progress harus antara 0 sampai 100.");
      return;
    }

    try {
      setUpdatingProjectId(project.id);

      await updateProjectProgress(
      project.id,
      progress,
      project.userId ?? null
    );

      await loadProjects();

      alert("Progress project berhasil diperbarui.");
    } catch (error) {
      console.error("UPDATE PROGRESS ERROR:", error);
      alert("Gagal update progress.");
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const handleUpdateEngineer = async (project: Project) => {
    const engineer = engineerValues[project.id];

    if (!engineer || !engineer.trim()) {
      alert("Nama engineer tidak boleh kosong.");
      return;
    }

    try {
      setUpdatingProjectId(project.id);

      await updateProjectEngineer(
        project.id,
        engineer,
        project.userId ?? null
      );

      await loadProjects();

      alert("Engineer project berhasil diperbarui.");
    } catch (error) {
      console.error("UPDATE ENGINEER ERROR:", error);
      alert("Gagal update engineer.");
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const handleCreateInvoice = async (project: Project) => {
    try {
      setCreatingInvoice(project.id);

      await createInvoice({
        projectId: project.id,
        bookingId: project.bookingId,
        userId: project.userId ?? null,
        clientName: project.clientName,
        clientEmail: project.clientEmail,
        projectName: project.name,
        title: `Invoice - ${project.name}`,
        amount: project.amount,
        dueDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
      });

      alert("Invoice berhasil dibuat.");
    } catch (error) {
      console.error("CREATE INVOICE ERROR:", error);
      alert("Gagal membuat invoice.");
    } finally {
      setCreatingInvoice(null);
    }
  };

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Projects</span>
          <h1>Manage Projects</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadProjects}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="admin-table-card">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="admin-table-card">
          Belum ada project. Buat project dari booking yang sudah approved.
        </div>
      ) : (
        <div className="admin-project-board">
          {projects.map((project) => (
            <article
              className="admin-project-card"
              key={project.id}
            >
              <div className="admin-project-card-top">
                <div>
                  <small>#{project.id.slice(0, 8)}</small>
                  <h3>{project.name}</h3>
                  <p>{project.clientName}</p>
                </div>

                <span
                  className={`admin-status ${getStatusClass(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="admin-project-progress">
                <div className="d-flex justify-content-between">
                  <span>Progress</span>
                  <strong>{project.progress || 0}%</strong>
                </div>

                <div className="admin-progress">
                  <div
                    style={{
                      width: `${project.progress || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="admin-project-details">
                <div>
                  <span>Engineer</span>
                  <strong>{project.engineer || "-"}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{project.location}</strong>
                </div>
              </div>

              <div className="admin-project-update-box">
                <div>
                  <label className="form-label">Progress</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="form-control form-control-sm"
                    value={progressValues[project.id] ?? 0}
                    onChange={(e) =>
                      setProgressValues({
                        ...progressValues,
                        [project.id]: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={updatingProjectId === project.id}
                  onClick={() => handleUpdateProgress(project)}
                >
                  {updatingProjectId === project.id
                    ? "Updating..."
                    : "Update Progress"}
                </button>

                <div>
                  <label className="form-label">Engineer</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Nama engineer"
                    value={engineerValues[project.id] ?? ""}
                    onChange={(e) =>
                      setEngineerValues({
                        ...engineerValues,
                        [project.id]: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={updatingProjectId === project.id}
                  onClick={() => handleUpdateEngineer(project)}
                >
                  Update Engineer
                </button>
              </div>

              <div className="admin-project-actions">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="btn btn-light btn-sm"
                >
                  View
                </Link>

                <button
                  className="btn btn-warning btn-sm"
                  disabled={creatingInvoice === project.id}
                  onClick={() => handleCreateInvoice(project)}
                >
                  {creatingInvoice === project.id
                    ? "Creating..."
                    : "Create Invoice"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}