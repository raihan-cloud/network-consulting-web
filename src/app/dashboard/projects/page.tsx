"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

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
};

export default function DashboardProjectsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  async function loadProjects() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "projects"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Project[];

      setProjects(data);
    } catch (error) {
      console.error("LOAD PROJECTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "-";

    return new Date(
      timestamp.seconds * 1000
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status: ProjectStatus) => {
    if (status === "completed") return "success";
    if (status === "implementation") return "warning";
    return "info";
  };

  if (loading) {
    return (
      <section className="client-dashboard-content">
        <div className="client-empty-state">
          <h3>Loading projects...</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Projects</span>
          <h1>My Projects</h1>
        </div>

        <Link href="/booking" className="btn btn-warning">
          New Project Request
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="client-empty-state">
          <i className="bi bi-kanban"></i>

          <h3>Belum ada project</h3>

          <p>
            Project akan muncul setelah booking Anda
            disetujui oleh tim NetPro.
          </p>

          <Link href="/booking" className="btn btn-warning">
            Buat Booking
          </Link>
        </div>
      ) : (
        <div className="client-projects-list">
          {projects.map((project) => (
            <div
              className="client-project-card"
              key={project.id}
            >
              <div className="client-project-top">
                <div>
                  <small>
                    #{project.id.slice(0, 8)}
                  </small>

                  <h3>{project.name}</h3>

                  <p>{project.packageType}</p>
                </div>

                <span
                  className={`project-status ${getStatusClass(
                    project.status
                  )}`}
                >
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
                  <strong>
                    {project.engineer || "-"}
                  </strong>
                </div>

                <div>
                  <span>Progress</span>
                  <strong>
                    {project.progress || 0}%
                  </strong>
                </div>
              </div>

              <div className="client-progress mt-3">
                <div
                  style={{
                    width: `${project.progress || 0}%`,
                  }}
                ></div>
              </div>

             <div className="client-project-footer">
                <small>
                  Updated: {formatDate(project.createdAt)}
                </small>

                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="btn btn-outline-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}