"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  createDocument,
  deleteDocument,
} from "@/lib/documentService";

type DocumentItem = {
  id: string;
  userId?: string | null;
  projectId?: string | null;
  clientName: string;
  clientEmail: string;
  title: string;
  projectName: string;
  fileType: string;
  fileUrl: string;
  visibility: "client" | "admin-only";
  status: "available" | "restricted";
  createdAt?: any;
  updatedAt?: any;
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    userId: "",
    projectId: "",
    clientName: "",
    clientEmail: "",
    title: "",
    projectName: "",
    fileType: "PDF",
    fileUrl: "",
    visibility: "client" as "client" | "admin-only",
  });

  async function loadDocuments() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "documents"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as DocumentItem[];

      setDocuments(data);
    } catch (error) {
      console.error("LOAD DOCUMENTS ERROR:", error);
      alert("Gagal mengambil data dokumen.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateDocument = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.clientName ||
      !form.clientEmail ||
      !form.title ||
      !form.projectName ||
      !form.fileUrl
    ) {
      alert("Client, title, project, dan URL dokumen wajib diisi.");
      return;
    }

    try {
      setCreating(true);

      await createDocument({
        userId: form.userId || null,
        projectId: form.projectId || null,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        title: form.title,
        projectName: form.projectName,
        fileType: form.fileType,
        fileUrl: form.fileUrl,
        visibility: form.visibility,
      });

      setForm({
        userId: "",
        projectId: "",
        clientName: "",
        clientEmail: "",
        title: "",
        projectName: "",
        fileType: "PDF",
        fileUrl: "",
        visibility: "client",
      });

      await loadDocuments();

      alert("Dokumen berhasil ditambahkan.");
    } catch (error) {
      console.error("CREATE DOCUMENT ERROR:", error);
      alert("Gagal menambahkan dokumen.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus dokumen ini?");

    if (!confirmDelete) return;

    try {
      setDeletingId(documentId);

      await deleteDocument(documentId);
      await loadDocuments();

      alert("Dokumen berhasil dihapus.");
    } catch (error) {
      console.error("DELETE DOCUMENT ERROR:", error);
      alert("Gagal menghapus dokumen.");
    } finally {
      setDeletingId(null);
    }
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

  const clientVisible = documents.filter(
    (doc) => doc.visibility === "client"
  ).length;

  const adminOnly = documents.filter(
    (doc) => doc.visibility === "admin-only"
  ).length;

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Documents</span>
          <h1>Document Management</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadDocuments}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="admin-document-stats">
        <div>
          <span>Total Documents</span>
          <strong>{documents.length}</strong>
          <small>All project links</small>
        </div>

        <div>
          <span>Client Visible</span>
          <strong>{clientVisible}</strong>
          <small>Shared to clients</small>
        </div>

        <div>
          <span>Admin Only</span>
          <strong>{adminOnly}</strong>
          <small>Internal files</small>
        </div>

        <div>
          <span>Storage Mode</span>
          <strong>Link</strong>
          <small>Google Drive / URL</small>
        </div>
      </div>

      <div className="admin-table-card mb-4">
        <div className="admin-panel-header">
          <div>
            <span>Add Document</span>
            <h2>Tambahkan dokumen via link</h2>
          </div>
        </div>

        <form onSubmit={handleCreateDocument}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Client Name</label>
              <input
                name="clientName"
                className="form-control"
                placeholder="Raihan Muzaffar"
                value={form.clientName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Client Email</label>
              <input
                type="email"
                name="clientEmail"
                className="form-control"
                placeholder="client@email.com"
                value={form.clientEmail}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">User ID</label>
              <input
                name="userId"
                className="form-control"
                placeholder="UID client dari Firebase Auth"
                value={form.userId}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Project ID</label>
              <input
                name="projectId"
                className="form-control"
                placeholder="Opsional"
                value={form.projectId}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Document Title</label>
              <input
                name="title"
                className="form-control"
                placeholder="Network Topology"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Project Name</label>
              <input
                name="projectName"
                className="form-control"
                placeholder="Corporate Office Network"
                value={form.projectName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">File Type</label>
              <select
                name="fileType"
                className="form-select"
                value={form.fileType}
                onChange={handleChange}
              >
                <option>PDF</option>
                <option>DOCX</option>
                <option>XLSX</option>
                <option>ZIP</option>
                <option>IMAGE</option>
                <option>LINK</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Visibility</label>
              <select
                name="visibility"
                className="form-select"
                value={form.visibility}
                onChange={handleChange}
              >
                <option value="client">Client Visible</option>
                <option value="admin-only">Admin Only</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">File URL</label>
              <input
                name="fileUrl"
                className="form-control"
                placeholder="https://drive.google.com/..."
                value={form.fileUrl}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-warning"
                disabled={creating}
              >
                {creating ? "Saving..." : "Save Document"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="admin-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Document ID</th>
                <th>Title</th>
                <th>Client</th>
                <th>Project</th>
                <th>Type</th>
                <th>Visibility</th>
                <th>Updated</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>Loading documents...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={8}>Belum ada dokumen.</td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <strong>#{doc.id.slice(0, 8)}</strong>
                    </td>

                    <td>
                      <div className="admin-document-title">
                        <span className="admin-document-icon">
                          <i
                            className={`bi ${
                              doc.fileType === "ZIP"
                                ? "bi-file-earmark-zip"
                                : doc.fileType === "IMAGE"
                                ? "bi-file-earmark-image"
                                : "bi-file-earmark-pdf"
                            }`}
                          ></i>
                        </span>
                        <strong>{doc.title}</strong>
                      </div>
                    </td>

                    <td>
                      <strong>{doc.clientName}</strong>
                      <br />
                      <small>{doc.clientEmail}</small>
                    </td>

                    <td>{doc.projectName}</td>
                    <td>{doc.fileType}</td>

                    <td>
                      <span
                        className={`admin-doc-visibility ${
                          doc.visibility === "client"
                            ? "client"
                            : "internal"
                        }`}
                      >
                        {doc.visibility}
                      </span>
                    </td>

                    <td>{formatDate(doc.updatedAt || doc.createdAt)}</td>

                    <td className="text-end">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-light btn-sm me-2"
                      >
                        Preview
                      </a>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={deletingId === doc.id}
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        {deletingId === doc.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}