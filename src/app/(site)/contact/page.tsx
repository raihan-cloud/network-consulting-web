"use client";

import Link from "next/link";
import { useState } from "react";
import { createContactMessage } from "@/lib/contactService";

const contactMethods = [
  {
    icon: "bi-whatsapp",
    title: "WhatsApp",
    value: "+62 812 xxxx xxxx",
    desc: "Untuk konsultasi cepat dan follow-up project.",
  },
  {
    icon: "bi-envelope",
    title: "Email",
    value: "netpro@email.com",
    desc: "Untuk proposal, kerja sama, dan dokumen project.",
  },
  {
    icon: "bi-geo-alt",
    title: "Location",
    value: "Aceh, Indonesia",
    desc: "Melayani kebutuhan project jaringan onsite dan remote.",
  },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    serviceType: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

    if (
      !form.name ||
      !form.whatsapp ||
      !form.email ||
      !form.serviceType ||
      !form.subject ||
      !form.message
    ) {
      alert("Semua field wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      await createContactMessage(form);

      alert("Pesan berhasil dikirim.");

      setForm({
        name: "",
        whatsapp: "",
        email: "",
        serviceType: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("CONTACT ERROR:", error);
      alert("Gagal mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="contact-hero">
        <div className="container">
          <span className="cf-eyebrow">Contact NetPro</span>
          <h1>Diskusikan kebutuhan jaringan Anda bersama tim kami.</h1>
          <p>
            Hubungi NetPro untuk konsultasi instalasi jaringan, MikroTik, fiber
            optik, CCTV, server, virtualisasi, dan maintenance infrastruktur IT.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-info">
              <span className="cf-eyebrow">Get in Touch</span>
              <h2>Kami siap membantu kebutuhan infrastruktur Anda.</h2>
              <p>
                Isi form berikut atau hubungi kami langsung melalui WhatsApp dan
                email. Tim kami akan meninjau kebutuhan Anda dan memberikan
                rekomendasi solusi yang sesuai.
              </p>

              <div className="contact-methods">
                {contactMethods.map((item) => (
                  <div className="contact-method" key={item.title}>
                    <div className="contact-method-icon">
                      <i className={`bi ${item.icon}`}></i>
                    </div>

                    <div>
                      <h4>{item.title}</h4>
                      <strong>{item.value}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-form-card">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      name="name"
                      className="form-control"
                      placeholder="Nama Anda"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Nomor WhatsApp</label>
                    <input
                      name="whatsapp"
                      className="form-control"
                      placeholder="+62 812 xxxx xxxx"
                      value={form.whatsapp}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="email@domain.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Jenis Kebutuhan</label>
                    <select
                      name="serviceType"
                      className="form-select"
                      value={form.serviceType}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Pilih kebutuhan
                      </option>
                      <option>Instalasi Jaringan</option>
                      <option>Fiber Optik</option>
                      <option>MikroTik</option>
                      <option>CCTV</option>
                      <option>Server & Virtualisasi</option>
                      <option>Konsultasi IT</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Subjek</label>
                    <input
                      name="subject"
                      className="form-control"
                      placeholder="Contoh: Konsultasi jaringan kantor"
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Pesan</label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows={6}
                      placeholder="Ceritakan kebutuhan jaringan atau project Anda..."
                      value={form.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-warning btn-lg"
                      disabled={loading}
                    >
                      {loading ? "Mengirim..." : "Kirim Pesan"}
                    </button>
                  </div>
                </div>
              </form>

              <p className="contact-note">
                Pesan akan masuk ke Firestore collection contacts dan bisa
                ditindaklanjuti oleh admin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="container">
          <div className="contact-cta-panel">
            <div>
              <span className="cf-eyebrow">Need a Faster Response?</span>
              <h2>Butuh respon cepat untuk project jaringan?</h2>
              <p>
                Gunakan halaman booking agar kebutuhan Anda langsung masuk ke
                alur konsultasi dan estimasi project.
              </p>
            </div>

            <Link href="/booking" className="btn btn-warning btn-lg">
              Booking Konsultasi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}