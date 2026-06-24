"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerClient } from "@/lib/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password dan konfirmasi password tidak sama.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password minimal 8 karakter.");
      return;
    }

    try {
      setLoading(true);

      await registerClient({
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        password: form.password,
      });

      alert("Akun berhasil dibuat.");

      router.push("/login");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.message ||
          "Terjadi kesalahan saat membuat akun."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="auth-modern-section">
        <div className="container">
          <div className="auth-modern-card">
            <div className="auth-modern-visual">
              <span className="cf-eyebrow">Create Account</span>

              <h1>Mulai perjalanan digital Anda bersama NetPro.</h1>

              <p>
                Buat akun client untuk mengelola booking,
                memantau progress project, mengakses
                dokumen teknis, invoice, dan layanan
                support dalam satu dashboard.
              </p>

              <div className="auth-benefits">
                <div>
                  <i className="bi bi-kanban"></i>
                  <span>Manage Projects</span>
                </div>

                <div>
                  <i className="bi bi-folder2-open"></i>
                  <span>Project Documents</span>
                </div>

                <div>
                  <i className="bi bi-shield-check"></i>
                  <span>Priority Support</span>
                </div>
              </div>
            </div>

            <div className="auth-modern-form-wrap">
              <div className="auth-form-header">
                <h2>Create Account</h2>

                <p>
                  Buat akun baru untuk mengakses Client
                  Portal NetPro.
                </p>
              </div>

              <form
                className="auth-modern-form"
                onSubmit={handleSubmit}
              >
                <div className="mb-3">
                  <label className="form-label">
                    Nama Lengkap
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Masukkan nama lengkap"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="email@domain.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Nomor WhatsApp
                  </label>

                  <input
                    type="text"
                    name="whatsapp"
                    className="form-control"
                    placeholder="+62 812 xxxx xxxx"
                    value={form.whatsapp}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Minimal 8 karakter"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Konfirmasi Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Ulangi password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-warning btn-lg w-100"
                >
                  {loading
                    ? "Membuat akun..."
                    : "Buat Akun"}
                </button>

                <div className="auth-divider">
                  <span>atau</span>
                </div>

                <Link
                  href="/booking"
                  className="btn btn-outline-primary btn-lg w-100"
                >
                  Booking Tanpa Akun
                </Link>

                <p className="auth-switch">
                  Sudah punya akun?{" "}
                  <Link href="/login">
                    Masuk sekarang
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}