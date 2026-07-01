"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { useParams } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  ProjectStatus,
  updateProjectEngineer,
  updateProjectStatus,
} from "@/lib/projectService";

type ProjectPhoto = {
  url: string;
  publicId: string;
  name: string;
};

type Engineer = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  specialization?: string;
  status: "active" | "inactive";
};

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

type ProjectLog = {
  id: string;
  projectId: string;
  type: string;
  title: string;
  description: string;
  progress?: number | null;
  engineer?: string;
  photos?: ProjectPhoto[];
  createdAt?: any;
};

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

const notifyProgress = [25, 50, 80, 100];

export default function AdminProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [engineer, setEngineer] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planning");

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [modalProgress, setModalProgress] = useState(25);
  const [modalStage, setModalStage] = useState("");
  const [modalNote, setModalNote] = useState("");
  const [modalPhotos, setModalPhotos] = useState<File[]>([]);

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
      setEngineer(projectData.engineer || "");
      setStatus(projectData.status || "planning");

      const logsQuery = query(
        collection(db, "project_logs"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc")
      );

      const engineersQuery = query(
        collection(db, "engineers"),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );

      const [logsSnap, engineersSnap] = await Promise.all([
        getDocs(logsQuery),
        getDocs(engineersQuery),
      ]);

      const logsData = logsSnap.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as ProjectLog[];

      const engineersData = engineersSnap.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Engineer[];

      setLogs(logsData);
      setEngineers(engineersData);
    } catch (error) {
      console.error("LOAD PROJECT DETAIL ERROR:", error);
      alert("Gagal memuat detail project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId) loadProjectDetail();
  }, [projectId]);

  const selectedEngineer = engineers.find((item) => item.name === engineer);

  const openProgressModal = () => {
    if (!project) return;

    const nextPreset =
      progressPresets.find((item) => item.value > (project.progress || 0)) ||
      progressPresets[progressPresets.length - 1];

    setModalProgress(nextPreset.value);
    setModalStage(project.progressStage || nextPreset.title);
    setModalNote(project.lastUpdate || nextPreset.note);
    setModalPhotos([]);
    setShowProgressModal(true);
  };

  const handlePresetClick = (value: number) => {
    const preset = progressPresets.find((item) => item.value === value);

    setModalProgress(value);
    setModalStage(preset?.title || "");
    setModalNote(preset?.note || "");
  };

  async function uploadProgressPhotos(projectId: string): Promise<ProjectPhoto[]> {
    if (modalPhotos.length === 0) return [];

    const uploadedPhotos: ProjectPhoto[] = [];

    for (const photo of modalPhotos) {
      const compressedFile = await imageCompression(photo, {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      });

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("projectId", projectId);

      const response = await fetch("/api/upload/project-progress", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal upload foto progress.");
      }

      uploadedPhotos.push({
        url: data.url,
        publicId: data.publicId,
        name: photo.name,
      });
    }

    return uploadedPhotos;
  }

  const handleSaveProgress = async () => {
    if (!project) return;

    if (modalProgress < 0 || modalProgress > 100) {
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
      setUpdating(true);

      const oldProgress = Number(project.progress || 0);
      const uploadedPhotos = await uploadProgressPhotos(project.id);

      const newStatus: ProjectStatus =
        modalProgress >= 100
          ? "completed"
          : modalProgress > 0
          ? "implementation"
          : "planning";

      await updateDoc(doc(db, "projects", project.id), {
        progress: modalProgress,
        status: newStatus,
        progressStage: modalStage,
        lastUpdate: modalNote,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "project_logs"), {
        projectId: project.id,
        userId: project.userId ?? null,
        type: "progress",
        title: modalStage,
        description: modalNote,
        progress: modalProgress,
        engineer: project.engineer || "-",
        photos: uploadedPhotos,
        photoUrls: uploadedPhotos.map((photo) => photo.url),
        photoCount: uploadedPhotos.length,
        createdAt: serverTimestamp(),
      });

      const phone = project.clientPhone || project.whatsapp;

      if (
        phone &&
        notifyProgress.includes(modalProgress) &&
        modalProgress !== oldProgress
      ) {
        const waResponse = await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            message: `🏗️ NetPro Operations Center

Halo ${project.clientName},

Progress project Anda telah diperbarui.

━━━━━━━━━━━━━━━
📁 Project
${project.name}

📈 Progress
${modalProgress}%

📍 Tahapan
${modalStage}

👷 Engineer
${project.engineer || "-"}

📝 Catatan
${modalNote}

📷 Dokumentasi
${uploadedPhotos.length > 0 ? `${uploadedPhotos.length} foto progress telah ditambahkan.` : "Belum ada foto progress."}

━━━━━━━━━━━━━━━
Silakan login ke Dashboard Client untuk melihat detail progress terbaru.

Terima kasih,
NetPro Indonesia`,
          }),
        });

        const waData = await waResponse.json();

        if (!waResponse.ok || waData.success === false) {
          console.error("WA SEND FAILED:", waData);
          alert("Progress tersimpan, tapi WhatsApp gagal dikirim.");
        }
      }

      setShowProgressModal(false);
      setModalPhotos([]);
      await loadProjectDetail();

      alert(
        phone && notifyProgress.includes(modalProgress)
          ? "Progress berhasil diperbarui dan WhatsApp dikirim."
          : "Progress berhasil diperbarui."
      );
    } catch (error) {
      console.error("UPDATE PROGRESS ERROR:", error);
      alert("Gagal memperbarui progress.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateEngineer = async () => {
    if (!project) return;

    if (!engineer.trim()) {
      alert("Pilih engineer terlebih dahulu.");
      return;
    }

    try {
      setUpdating(true);

      await updateProjectEngineer(project.id, engineer, project.userId ?? null);

      await updateDoc(doc(db, "projects", project.id), {
        engineerId: selectedEngineer?.id || null,
        engineerName: selectedEngineer?.name || engineer,
        engineerRole: selectedEngineer?.role || "",
        engineerPhone: selectedEngineer?.phone || "",
        engineerSpecialization: selectedEngineer?.specialization || "",
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "project_logs"), {
        projectId: project.id,
        userId: project.userId ?? null,
        type: "engineer",
        title: "Engineer Assigned",
        description: `${engineer} ditugaskan untuk menangani project ini.`,
        engineer,
        createdAt: serverTimestamp(),
      });

      const phone = project.clientPhone || project.whatsapp;

      if (phone) {
        await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            message: `👷 NetPro Engineer Assigned

Halo ${project.clientName},

Engineer untuk project Anda telah ditugaskan.

━━━━━━━━━━━━━━━
📁 Project
${project.name}

👷 Engineer
${engineer}

🧩 Role
${selectedEngineer?.role || "-"}

🛠️ Spesialisasi
${selectedEngineer?.specialization || "-"}

━━━━━━━━━━━━━━━
Silakan pantau progress project melalui Dashboard Client.

Terima kasih,
NetPro Indonesia`,
          }),
        });
      }

      await loadProjectDetail();

      alert("Engineer berhasil diperbarui.");
    } catch (error) {
      console.error("UPDATE ENGINEER ERROR:", error);
      alert("Gagal memperbarui engineer.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!project) return;

    try {
      setUpdating(true);

      await updateProjectStatus(project.id, status, project.userId ?? null);
      await loadProjectDetail();

      alert("Status project berhasil diperbarui.");
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
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

  const getStatusClass = (value: ProjectStatus) => {
    if (value === "completed") return "completed";
    if (value === "implementation") return "approved";
    if (value === "cancelled") return "rejected";
    return "pending";
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

      <div className="project-detail-hero">
        <div>
          <span className={`admin-status ${getStatusClass(project.status)}`}>
            {project.status}
          </span>

          <h2>{project.name}</h2>
          <p>
            Project untuk <strong>{project.clientName}</strong> di{" "}
            {project.location}.
          </p>
        </div>

        <div className="project-detail-progress-circle">
          <strong>{project.progress || 0}%</strong>
          <span>Progress</span>
        </div>
      </div>

      <div className="admin-progress project-detail-main-progress">
        <div style={{ width: `${project.progress || 0}%` }}></div>
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
              <span>Phone</span>
              <strong>{project.clientPhone || project.whatsapp || "-"}</strong>
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

            <div>
              <span>Last Stage</span>
              <strong>{project.progressStage || "-"}</strong>
            </div>
          </div>

          {project.lastUpdate && (
            <div className="project-last-update-box">
              <i className="bi bi-info-circle"></i>
              <p>{project.lastUpdate}</p>
            </div>
          )}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span>Quick Actions</span>
              <h2>Manage Project</h2>
            </div>
          </div>

          <div className="project-action-stack">
            <button
              className="btn btn-warning w-100"
              onClick={openProgressModal}
              disabled={updating}
            >
              <i className="bi bi-kanban me-2"></i>
              Update Progress
            </button>

            <div>
              <label className="form-label">Engineer</label>
              <select
                className="form-select"
                value={engineer}
                onChange={(e) => setEngineer(e.target.value)}
              >
                <option value="">Pilih engineer</option>
                {engineers.map((item) => (
                  <option value={item.name} key={item.id}>
                    {item.name} — {item.role}
                  </option>
                ))}
              </select>

              {selectedEngineer && (
                <div className="assigned-engineer-preview">
                  <strong>{selectedEngineer.name}</strong>
                  <span>{selectedEngineer.role}</span>
                  <small>{selectedEngineer.specialization || "-"}</small>
                </div>
              )}

              <button
                className="btn btn-outline-primary mt-2 w-100"
                disabled={updating}
                onClick={handleUpdateEngineer}
              >
                Assign Engineer
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
                className="btn btn-outline-primary mt-2 w-100"
                disabled={updating}
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="admin-panel project-timeline-panel">
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

                    {log.photos && log.photos.length > 0 && (
                      <div className="project-log-gallery">
                        {log.photos.map((photo) => (
                          <a
                            href={photo.url}
                            target="_blank"
                            rel="noreferrer"
                            key={photo.publicId}
                          >
                            <img src={photo.url} alt={photo.name} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showProgressModal && (
        <div className="progress-modal-backdrop">
          <div className="progress-modal-card">
            <div className="progress-modal-header">
              <div>
                <span>PROJECT PROGRESS</span>
                <h2>Update Progress</h2>
                <p>{project.name}</p>
              </div>

              <button onClick={() => setShowProgressModal(false)}>
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

              <label>
                Foto Progress
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);

                    const validFiles = files.filter((file) => {
                      const maxSize = 2 * 1024 * 1024;
                      return file.size <= maxSize;
                    });

                    if (validFiles.length !== files.length) {
                      alert("Sebagian foto terlalu besar. Maksimal 2MB per foto.");
                    }

                    setModalPhotos(validFiles);
                  }}
                />
              </label>

              {modalPhotos.length > 0 && (
                <div className="progress-upload-preview">
                  {modalPhotos.map((photo) => (
                    <div key={photo.name}>
                      <i className="bi bi-image"></i>
                      <span>{photo.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="progress-modal-footer">
              <button
                className="btn btn-light"
                onClick={() => setShowProgressModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-warning"
                onClick={handleSaveProgress}
                disabled={updating}
              >
                {updating ? "Saving..." : "Simpan Progress"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}