"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
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

    if (!loading && profile?.role === "admin") {
      router.push("/admin");
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return <div className="auth-loading">Loading dashboard...</div>;
  }

  if (!user || profile?.role === "admin") {
    return null;
  }

  return (
    <div className="client-dashboard-shell">
      <DashboardSidebar />
      <main className="client-dashboard-main">{children}</main>
    </div>
  );
}