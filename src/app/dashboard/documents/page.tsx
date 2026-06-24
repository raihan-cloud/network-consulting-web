"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

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

export default function DashboardDocumentsPage() {
  const { user } = useAuth();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDocuments() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "documents"),
        where("userId", "==", user.uid),
        where("visibility", "==", "client"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as DocumentItem[];

      setDocuments(data);
    } catch (error) {
      console.error("LOAD CLIENT DOCUMENTS ERROR:", error);
      alert("Gagal mengambil data dokumen.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [user]);

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

  const getIcon = (fileType: string) => {
    if (fileType === "ZIP") return "bi-file-earmark-zip";
    if (fileType === "IMAGE") return "bi-file-earmark-image";
    if (fileType === "DOCX") return "bi-file-earmark-word";
    if (fileType === "XLSX") return "bi-file-earmark-excel";
    if (fileType === "LINK") return "bi-link-45deg";

    return "bi-file-earmark-pdf";
  };

  return (
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Documents</span>
          <h1>Project Documents</h1>
        </div>

        <button
          className="btn btn-light"
          onClick={loadDocuments}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="client-documents-toolbar">
        <div className="client-doc-search">
          <i className="bi bi-search"></i>
          <input placeholder="Search documents..." />
        </div>

        <select>
          <option>All Projects</option>
          {documents.map((doc) => (
            <option key={doc.id}>{doc.projectName}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="client-empty-state">
          <h3>Loading documents...</h3>
        </div>
      ) : documents.length === 0 ? (
        <div className="client-empty-state">
          <i className="bi bi-folder2-open"></i>

          <h3>Belum ada dokumen</h3>

          <p>
            Dokumen project akan muncul setelah admin membagikan link dokumen
            kepada Anda.
          </p>
        </div>
      ) : (
        <div className="client-documents-grid">
          {documents.map((doc) => (
            <article className="client-document-card" key={doc.id}>
              <div className="document-card-top">
                <div className="document-icon">
                  <i className={`bi ${getIcon(doc.fileType)}`}></i>
                </div>

                <span
                  className={`document-status ${
                    doc.status === "available"
                      ? "available"
                      : "restricted"
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <div className="document-card-body">
                <small>#{doc.id.slice(0, 8)}</small>

                <h3>{doc.title}</h3>

                <p>{doc.projectName}</p>
              </div>

              <div className="document-card-meta">
                <div>
                  <span>Type</span>
                  <strong>{doc.fileType}</strong>
                </div>

                <div>
                  <span>Visibility</span>
                  <strong>{doc.visibility}</strong>
                </div>

                <div>
                  <span>Updated</span>
                  <strong>
                    {formatDate(doc.updatedAt || doc.createdAt)}
                  </strong>
                </div>
              </div>

              <div className="document-card-actions">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light"
                >
                  <i className="bi bi-eye me-2"></i>
                  Preview
                </a>

                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  <i className="bi bi-download me-2"></i>
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}