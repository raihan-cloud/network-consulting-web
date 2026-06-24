"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (!loading && profile?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return <div className="auth-loading">Loading admin...</div>;
  }

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}