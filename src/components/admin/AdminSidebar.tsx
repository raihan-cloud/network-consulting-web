"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { label: "Overview", href: "/admin", icon: "bi-speedometer2" },
  { label: "Bookings", href: "/admin/bookings", icon: "bi-calendar-check" },
  { label: "Projects", href: "/admin/projects", icon: "bi-kanban" },
  { label: "Clients", href: "/admin/clients", icon: "bi-people" },
  { label: "Invoices", href: "/admin/invoices", icon: "bi-receipt" },
  { label: "Documents", href: "/admin/documents", icon: "bi-folder2-open" },
  { label: "Support", href: "/admin/support", icon: "bi-headset" },
  { label: "Reports", href: "/admin/reports", icon: "bi-bar-chart" },
  { label: "Settings", href: "/admin/settings", icon: "bi-gear" },
  { label: "Contacts", href: "/admin/contacts", icon: "bi-envelope" },
  { label: "Notifications", href: "/admin/notifications", icon: "bi-bell" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="admin-brand-icon">
          <i className="bi bi-diagram-3-fill"></i>
        </span>

        <div>
          <strong>NETPRO</strong>
          <small>Operations Center</small>
        </div>
      </div>

      <nav className="admin-menu">
        {menuItems.map((item) => (
          <Link href={item.href} className="admin-menu-link" key={item.href}>
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <span className="admin-status-dot"></span>
        <div>
          <strong>{profile?.name || "Admin User"}</strong>
          <small>{profile?.email || "Operations Admin"}</small>
        </div>
      </div>

      <button className="admin-logout-btn" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i>
        Logout
      </button>
    </aside>
  );
}