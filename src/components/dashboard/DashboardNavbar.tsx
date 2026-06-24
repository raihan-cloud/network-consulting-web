"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardNavbar() {
  const { profile } = useAuth();

  const firstName =
    profile?.name?.split(" ")[0] || "Client";

  return (
    <header className="client-topbar">
      <div>
        <span className="client-page-label">
          Overview
        </span>

        <h1>
          Welcome back, {firstName}
        </h1>

        <small className="text-muted">
          {profile?.email || ""}
        </small>
      </div>

      <div className="client-topbar-actions">
        <Link
          href="/booking"
          className="btn btn-warning"
        >
          <i className="bi bi-plus-circle me-2"></i>
          New Booking
        </Link>

        <Link
          href="/"
          className="btn btn-light"
        >
          <i className="bi bi-globe me-2"></i>
          Back to Website
        </Link>
      </div>
    </header>
  );
}