"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { services } from "@/data/services";
import { createBooking } from "@/lib/bookingService";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";

const packages = [
  {
    id: "consultation",
    name: "Konsultasi Awal",
    price: "Gratis",
    amount: 0,
    desc: "Diskusi awal kebutuhan jaringan dan rekomendasi layanan.",
    features: ["30 menit konsultasi", "Rekomendasi solusi", "Estimasi awal"],
  },
  {
    id: "survey",
    name: "Survey Lokasi",
    price: "Rp250.000",
    amount: 250000,
    desc: "Pengecekan lokasi sebelum instalasi atau upgrade jaringan.",
    features: ["Survey onsite", "Analisis titik jaringan", "Estimasi project"],
    recommended: true,
  },
  {
    id: "dp-project",
    name: "DP Project",
    price: "Rp500.000",
    amount: 500000,
    desc: "Booking jadwal pengerjaan untuk project instalasi.",
    features: ["Booking jadwal", "Prioritas pengerjaan", "Invoice DP"],
  },
];

export default function BookingPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(
    "network-infrastructure"
  );
  const [selectedPackage, setSelectedPackage] = useState("survey");

  const [form, setForm] = useState({
    name: profile?.name || "",
    whatsapp: profile?.whatsapp || "",
    email: profile?.email || "",
    company: "",
    location: "",
    budget: "Belum tahu",
    description: "",
  });

  const selectedServiceData =
    services.find((item) => item.slug === selectedService) || services[0];

  const selectedPackageData =
    packages.find((item) => item.id === selectedPackage) || packages[1];

  const isConsultation = selectedPackageData.id === "consultation";

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

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.whatsapp || !form.location) {
      alert("Nama, email, WhatsApp, dan lokasi project wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      if (isConsultation) {
        await addDoc(collection(db, "consultations"), {
          userId: user?.uid || null,
          name: form.name,
          email: form.email,
          phone: form.whatsapp,
          whatsapp: form.whatsapp,
          company: form.company,
          service: selectedServiceData.title,
          packageType: selectedPackageData.name,
          location: form.location,
          budget: form.budget,
          message: form.description,
          description: form.description,
          status: "New",
          source: "booking-page",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        router.push("/consultation/success");
        return;
      }

      await createBooking({
        userId: user?.uid,
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        company: form.company,
        service: selectedServiceData.title,
        packageType: selectedPackageData.name,
        location: form.location,
        budget: form.budget,
        description: form.description,
        amount: selectedPackageData.amount,
        status: "pending",
      });

      router.push("/booking/success");
    } catch (error) {
      console.error(error);
      alert(
        isConsultation
          ? "Gagal mengirim konsultasi. Silakan coba lagi."
          : "Gagal membuat booking. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="checkout-hero">
        <div className="container">
          <span className="cf-eyebrow">Booking Checkout</span>
          <h1>Booking layanan jaringan dengan alur transaksi yang jelas.</h1>
          <p>
            Pilih layanan, tentukan paket, isi data pemesan, lalu permintaan
            booking akan masuk ke dashboard admin NetPro.
          </p>
        </div>
      </section>

      <section className="checkout-section">
        <div className="container">
          <div className="checkout-layout">
            <div className="checkout-main">
              <div className="checkout-block">
                <div className="checkout-block-header">
                  <span>01</span>
                  <h2>Pilih layanan</h2>
                </div>

                <select
                  className="form-select checkout-input"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  {services.map((service) => (
                    <option value={service.slug} key={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="checkout-block">
                <div className="checkout-block-header">
                  <span>02</span>
                  <h2>Pilih paket transaksi</h2>
                </div>

                <div className="checkout-package-grid">
                  {packages.map((item) => (
                    <label
                      className={`checkout-package-card ${
                        selectedPackage === item.id ? "recommended" : ""
                      }`}
                      key={item.id}
                    >
                      <input
                        type="radio"
                        name="package"
                        checked={selectedPackage === item.id}
                        onChange={() => setSelectedPackage(item.id)}
                      />

                      {item.recommended && (
                        <small className="package-badge">Recommended</small>
                      )}

                      <h3>{item.name}</h3>
                      <strong>{item.price}</strong>
                      <p>{item.desc}</p>

                      <ul>
                        {item.features.map((feature) => (
                          <li key={feature}>
                            <i className="bi bi-check2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </label>
                  ))}
                </div>
              </div>

              <div className="checkout-block">
                <div className="checkout-block-header">
                  <span>03</span>
                  <h2>Data pemesan</h2>
                </div>

                <form className="checkout-form">
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
                      <label className="form-label">Instansi / Bisnis</label>
                      <input
                        name="company"
                        className="form-control"
                        placeholder="PT / Sekolah / Cafe / Personal"
                        value={form.company}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Lokasi Project</label>
                      <input
                        name="location"
                        className="form-control"
                        placeholder="Kota, kecamatan, atau alamat singkat"
                        value={form.location}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Estimasi Budget</label>
                      <select
                        name="budget"
                        className="form-select"
                        value={form.budget}
                        onChange={handleChange}
                      >
                        <option>Belum tahu</option>
                        <option>&lt; Rp1.000.000</option>
                        <option>Rp1.000.000 - Rp5.000.000</option>
                        <option>Rp5.000.000 - Rp15.000.000</option>
                        <option>&gt; Rp15.000.000</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Detail Kebutuhan</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows={5}
                        placeholder="Contoh: ingin memasang jaringan kantor 2 lantai untuk 30 user..."
                        value={form.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <aside className="checkout-summary">
              <div className="summary-card">
                <span className="cf-eyebrow">
                  {isConsultation ? "Consultation Summary" : "Order Summary"}
                </span>

                <h3>
                  {isConsultation
                    ? "Ringkasan Konsultasi"
                    : "Ringkasan Booking"}
                </h3>

                <div className="summary-row">
                  <span>Layanan</span>
                  <strong>{selectedServiceData.title}</strong>
                </div>

                <div className="summary-row">
                  <span>Paket</span>
                  <strong>{selectedPackageData.name}</strong>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{selectedPackageData.price}</strong>
                </div>

                <div className="summary-row">
                  <span>Biaya admin</span>
                  <strong>Rp0</strong>
                </div>

                <div className="summary-total">
                  <span>Total</span>
                  <strong>{selectedPackageData.price}</strong>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn btn-warning btn-lg w-100"
                >
                  {loading
                    ? isConsultation
                      ? "Mengirim Konsultasi..."
                      : "Menyimpan Booking..."
                    : isConsultation
                    ? "Kirim Konsultasi"
                    : "Buat Booking"}
                </button>

                <p className="summary-note">
                  {isConsultation
                    ? "Permintaan konsultasi akan masuk ke dashboard admin NetPro untuk ditinjau."
                    : "Booking akan disimpan ke Firestore dengan status pending. Admin NetPro akan meninjau permintaan Anda."}
                </p>
              </div>

              {!isConsultation && (
                <div className="payment-method-card">
                  <h4>Metode pembayaran nanti</h4>

                  <div className="payment-method">
                    <i className="bi bi-bank"></i>
                    Transfer Bank
                  </div>

                  <div className="payment-method">
                    <i className="bi bi-wallet2"></i>
                    E-Wallet
                  </div>

                  <div className="payment-method">
                    <i className="bi bi-credit-card"></i>
                    Virtual Account
                  </div>
                </div>
              )}
            </aside>
          </div>

          <div className="checkout-bottom-link">
            <Link href="/services">
              <i className="bi bi-arrow-left"></i> Kembali ke layanan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}