"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "bi-grid-1x2",
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: "bi-kanban",
  },
  {
    label: "Bookings",
    href: "/dashboard/bookings",
    icon: "bi-calendar-check",
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: "bi-folder2-open",
  },
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: "bi-receipt",
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: "bi-bell",
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: "bi-headset",
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: "bi-person",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "bi-gear",
  },
];

export default function DashboardSidebar() {
  const router = useRouter();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <aside className="client-sidebar">
      <div className="client-sidebar-brand">
        <span className="client-brand-icon">
          <i className="bi bi-diagram-3-fill"></i>
        </span>
        <div>
          <strong>NetPro</strong>
          <small>Client Portal</small>
        </div>
      </div>

      <nav className="client-sidebar-menu">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href} className="client-menu-link">
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="client-sidebar-user">
        <div className="client-avatar">
          {profile?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <strong>{profile?.name || "Client User"}</strong>
          <small>{profile?.email || "Client Account"}</small>
        </div>
      </div>

      <button className="dashboard-logout-btn" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i>
        Logout
      </button>
    </aside>
  );
}