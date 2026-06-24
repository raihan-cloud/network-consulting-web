"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/authService";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    try {
      setLoading(true);

      const { profile } = await loginUser(
        form.email,
        form.password
      );

      const role = profile.role;

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error);

      alert(
        error?.message ||
          "Email atau password salah."
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
              <span className="cf-eyebrow">Client Portal</span>

              <h1>
                Kelola layanan jaringan Anda dalam satu dashboard.
              </h1>

              <p>
                Pantau status booking, project, invoice, dokumen
                teknis, dan support layanan NetPro secara lebih
                mudah.
              </p>

              <div className="auth-benefits">
                <div>
                  <i className="bi bi-kanban"></i>
                  <span>Project tracking</span>
                </div>

                <div>
                  <i className="bi bi-receipt"></i>
                  <span>Invoice & billing</span>
                </div>

                <div>
                  <i className="bi bi-headset"></i>
                  <span>Support ticket</span>
                </div>
              </div>
            </div>

            <div className="auth-modern-form-wrap">
              <div className="auth-form-header">
                <h2>Welcome back</h2>
                <p>Masuk menggunakan akun NetPro.</p>
              </div>

              <form
                className="auth-modern-form"
                onSubmit={handleSubmit}
              >
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

                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <label className="form-label">
                      Password
                    </label>

                    <Link href="#" className="auth-small-link">
                      Forgot?
                    </Link>
                  </div>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-warning w-100 btn-lg mt-3"
                >
                  {loading
                    ? "Memproses..."
                    : "Masuk ke Dashboard"}
                </button>

                <div className="auth-divider">
                  <span>atau</span>
                </div>

                <Link
                  href="/booking"
                  className="btn btn-outline-primary w-100 btn-lg"
                >
                  Booking Tanpa Login
                </Link>

                <p className="auth-switch">
                  Belum punya akun?{" "}
                  <Link href="/register">
                    Daftar sekarang
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