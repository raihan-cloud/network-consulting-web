import Link from "next/link";
import { services } from "@/data/services";

const process = [
  "Analisis kebutuhan",
  "Desain topologi",
  "Instalasi & konfigurasi",
  "Testing & dokumentasi",
  "Maintenance & support",
];

export default function ServicesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="services-hero">
        <div className="container">
          <span className="cf-eyebrow">Our Services</span>

          <h1>
            Solusi infrastruktur jaringan untuk organisasi modern.
          </h1>

          <p>
            Kami menyediakan layanan instalasi, konfigurasi, konsultasi,
            implementasi, dan maintenance infrastruktur IT untuk bisnis,
            sekolah, kampus, instansi, dan perusahaan.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="services-overview">
        <div className="container">
          <div className="services-intro">
            <h2>
              Layanan yang dirancang untuk kebutuhan operasional nyata.
            </h2>

            <p>
              Mulai dari jaringan, fiber optik, MikroTik, server, CCTV,
              hingga konsultasi infrastruktur IT yang dapat disesuaikan
              dengan kebutuhan organisasi Anda.
            </p>
          </div>

          <div className="services-list">
            {services.map((service) => (
              <article
                className="service-detail-card"
                key={service.slug}
              >
                <div className="service-detail-number">
                  {service.number}
                </div>

                <div className="service-detail-content">
                  <h3>{service.title}</h3>

                  <p>{service.shortDesc}</p>

                  <div className="service-tags">
                    {service.points
                      .slice(0, 4)
                      .map((point) => (
                        <span key={point}>{point}</span>
                      ))}
                  </div>
                </div>

                <Link
                  href={`/services/${service.slug}`}
                  className="service-detail-link"
                >
                  Learn More
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="service-process">
        <div className="container">
          <div className="service-process-header">
            <span className="cf-eyebrow">Our Process</span>

            <h2>
              Proses kerja yang jelas dari awal hingga implementasi.
            </h2>
          </div>

          <div className="process-grid">
            {process.map((item, index) => (
              <div className="process-item" key={item}>
                <strong>
                  {String(index + 1).padStart(2, "0")}
                </strong>

                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta">
        <div className="container">
          <div className="services-cta-panel">
            <div>
              <span className="cf-eyebrow">
                Need Consultation?
              </span>

              <h2>
                Bingung menentukan solusi jaringan yang tepat?
              </h2>

              <p>
                Ceritakan kebutuhan jaringan Anda dan tim kami akan
                membantu menganalisis kebutuhan serta memberikan
                rekomendasi solusi terbaik.
              </p>
            </div>

            <Link
              href="/booking"
              className="btn btn-warning btn-lg"
            >
              Jadwalkan Konsultasi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}