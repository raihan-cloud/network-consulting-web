"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { createInvoice } from "@/lib/invoiceService";
import { updateProjectEngineer } from "@/lib/projectService";

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
  clientPhone?: string;
  whatsapp?: string;
  name: string;
  packageType: string;
  location: string;
  amount: number;
  status: ProjectStatus;
  progress: number;
  engineer: string;
  progressStage?: string;
  lastUpdate?: string;
  createdAt?: any;
  updatedAt?: any;
};

const notifyProgress = [25, 50, 80, 100];

const progressPresets = [
  {
    value: 25,
    title: "Survey dan analisis kebutuhan",
    note: "Survey lokasi selesai dan kebutuhan jaringan sudah dianalisis.",
  },
  {
    value: 50,
    title: "Instalasi dan konfigurasi awal",
    note: "Instalasi perangkat dan konfigurasi awal sedang berjalan.",
  },
  {
    value: 80,
    title: "Testing jaringan dan optimasi",
    note: "Testing koneksi dan optimasi jaringan sedang dilakukan.",
  },
  {
    value: 100,
    title: "Project selesai",
    note: "Project telah selesai dan siap digunakan.",
  },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingInvoice, setCreatingInvoice] = useState<string | null>(null);
  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);

  const [engineerValues, setEngineerValues] = useState<Record<string, string>>({});

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalProgress, setModalProgress] = useState(25);
  const [modalStage, setModalStage] = useState("");
  const [modalNote, setModalNote] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);

      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Project[];

      setProjects(data);

      const engineerMap: Record<string, string> = {};
      data.forEach((project) => {
        engineerMap[project.id] = project.engineer || "";
      });

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

  const openProgressModal = (project: Project) => {
    const nearestPreset =
      progressPresets.find((item) => item.value > (project.progress || 0)) ||
      progressPresets[progressPresets.length - 1];

    setSelectedProject(project);
    setModalProgress(nearestPreset.value);
    setModalStage(project.progressStage || nearestPreset.title);
    setModalNote(project.lastUpdate || nearestPreset.note);
  };

  const closeProgressModal = () => {
    setSelectedProject(null);
    setModalProgress(25);
    setModalStage("");
    setModalNote("");
  };

  const handlePresetClick = (value: number) => {
    const preset = progressPresets.find((item) => item.value === value);

    setModalProgress(value);
    setModalStage(preset?.title || "");
    setModalNote(preset?.note || "");
  };

  const handleSaveProgress = async () => {
    if (!selectedProject) return;

    const progress = Number(modalProgress);

    if (progress < 0 || progress > 100) {
      alert("Progress harus antara 0 sampai 100.");
      return;
    }

    if (!modalStage.trim()) {
      alert("Tahapan progress wajib diisi.");
      return;
    }

    if (!modalNote.trim()) {
      alert("Catatan progress wajib diisi.");
      return;
    }

    try {
      setUpdatingProjectId(selectedProject.id);

      const oldProgress = Number(selectedProject.progress || 0);

      const newStatus: ProjectStatus =
        progress >= 100
          ? "completed"
          : progress > 0
          ? "implementation"
          : "planning";

      await updateDoc(doc(db, "projects", selectedProject.id), {
        progress,
        status: newStatus,
        progressStage: modalStage,
        lastUpdate: modalNote,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "project_logs"), {
        projectId: selectedProject.id,
        userId: selectedProject.userId ?? null,
        title: modalStage,
        description: modalNote,
        progress,
        engineer: selectedProject.engineer || "-",
        type: "progress",
        createdAt: serverTimestamp(),
      });

      const phone = selectedProject.clientPhone || selectedProject.whatsapp;

      if (phone && notifyProgress.includes(progress) && progress !== oldProgress) {
        await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            message: `🏗️ NetPro Operations Center

Halo ${selectedProject.clientName},

Progress project Anda telah diperbarui.

━━━━━━━━━━━━━━━
📁 Project
${selectedProject.name}

📈 Progress
${progress}%

📍 Tahapan
${modalStage}

👷 Engineer
${selectedProject.engineer || "-"}

📝 Catatan
${modalNote}

━━━━━━━━━━━━━━━
Silakan login ke Dashboard Client untuk melihat detail progress terbaru.

Terima kasih,
NetPro Indonesia`,
          }),
        });
      }

      await loadProjects();
      closeProgressModal();

      alert(
        phone && notifyProgress.includes(progress)
          ? "Progress berhasil diperbarui dan WhatsApp dikirim."
          : "Progress berhasil diperbarui."
      );
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

      await updateProjectEngineer(project.id, engineer, project.userId ?? null);

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
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
            <article className="admin-project-card" key={project.id}>
              <div className="admin-project-card-top">
                <div>
                  <small>#{project.id.slice(0, 8)}</small>
                  <h3>{project.name}</h3>
                  <p>{project.clientName}</p>
                </div>

                <span className={`admin-status ${getStatusClass(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <div className="admin-project-progress">
                <div className="d-flex justify-content-between">
                  <span>Progress</span>
                  <strong>{project.progress || 0}%</strong>
                </div>

                <div className="admin-progress">
                  <div style={{ width: `${project.progress || 0}%` }}></div>
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

              {project.progressStage && (
                <div className="admin-project-details mt-3">
                  <div>
                    <span>Tahapan</span>
                    <strong>{project.progressStage}</strong>
                  </div>

                  <div>
                    <span>Update</span>
                    <strong>{project.lastUpdate || "-"}</strong>
                  </div>
                </div>
              )}

              <div className="admin-project-update-box">
                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={updatingProjectId === project.id}
                  onClick={() => openProgressModal(project)}
                >
                  <i className="bi bi-kanban me-2"></i>
                  Update Progress
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
                  {creatingInvoice === project.id ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedProject && (
        <div className="progress-modal-backdrop">
          <div className="progress-modal-card">
            <div className="progress-modal-header">
              <div>
                <span>PROJECT PROGRESS</span>
                <h2>Update Progress</h2>
                <p>{selectedProject.name}</p>
              </div>

              <button onClick={closeProgressModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="progress-modal-presets">
              {progressPresets.map((item) => (
                <button
                  key={item.value}
                  className={modalProgress === item.value ? "active" : ""}
                  onClick={() => handlePresetClick(item.value)}
                >
                  <strong>{item.value}%</strong>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>

            <div className="progress-modal-form">
              <label>
                Progress
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={modalProgress}
                  onChange={(e) => setModalProgress(Number(e.target.value))}
                />
              </label>

              <label>
                Tahapan Pekerjaan
                <input
                  value={modalStage}
                  onChange={(e) => setModalStage(e.target.value)}
                  placeholder="Contoh: Instalasi router dan switch"
                />
              </label>

              <label>
                Catatan Engineer
                <textarea
                  rows={5}
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="Tuliskan detail pekerjaan yang sudah dilakukan..."
                />
              </label>
            </div>

            <div className="progress-modal-footer">
              <button className="btn btn-light" onClick={closeProgressModal}>
                Cancel
              </button>

              <button
                className="btn btn-warning"
                onClick={handleSaveProgress}
                disabled={updatingProjectId === selectedProject.id}
              >
                {updatingProjectId === selectedProject.id
                  ? "Saving..."
                  : "Simpan Progress"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}