import Link from "next/link";
import { projects } from "@/data/projects";

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "1000+", label: "Connected Devices" },
  { value: "99%", label: "Target Availability" },
  { value: "24/7", label: "Support Ready" },
];

export default function ProjectsPage() {
  const featuredProject = projects[0];

  return (
    <main>
      <section className="projects-hero">
        <div className="container">
          <span className="cf-eyebrow">Projects</span>

          <h1>Real projects. Real infrastructure. Real results.</h1>

          <p>
            Beberapa contoh implementasi jaringan, fiber optik, CCTV, MikroTik,
            server, dan infrastruktur IT untuk berbagai kebutuhan organisasi.
          </p>
        </div>
      </section>

      <section className="featured-project-section">
        <div className="container">
          <div className="featured-project-panel">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5">
                <span className="cf-eyebrow">Featured Case Study</span>

                <h2>{featuredProject.title}</h2>

                <p>{featuredProject.summary}</p>

                <div className="featured-project-specs">
                  {featuredProject.specs.map((spec) => (
                    <span key={spec}>{spec}</span>
                  ))}
                </div>

                <Link
                  href={`/projects/${featuredProject.slug}`}
                  className="btn btn-warning btn-lg mt-4"
                >
                  View Case Study
                </Link>
              </div>

              <div className="col-lg-7">
                <div className="project-visual">
                  <div className="project-visual-header">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="project-visual-body">
                    <div className="project-device core">
                      <i className="bi bi-router"></i>
                      Core Router
                    </div>
                    <div className="project-device sw">
                      <i className="bi bi-hdd-network"></i>
                      Switch
                    </div>
                    <div className="project-device ap">
                      <i className="bi bi-wifi"></i>
                      Access Point
                    </div>
                    <div className="project-device cctv">
                      <i className="bi bi-camera-video"></i>
                      CCTV
                    </div>
                    <div className="project-device server">
                      <i className="bi bi-server"></i>
                      Server
                    </div>

                    <span className="project-line pl1"></span>
                    <span className="project-line pl2"></span>
                    <span className="project-line pl3"></span>
                    <span className="project-line pl4"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects-grid-section">
        <div className="container">
          <div className="projects-header">
            <div>
              <span className="cf-eyebrow">Case Studies</span>
              <h2>Project portfolio untuk berbagai kebutuhan jaringan.</h2>
            </div>

            <p>
              Contoh project berikut dapat disesuaikan dengan kebutuhan kantor,
              sekolah, kampus, retail, gudang, dan instansi.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <Link
                href={`/projects/${project.slug}`}
                className="project-card"
                key={project.slug}
              >
                <div>
                  <span>{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>

                <div className="project-card-meta">
                  <strong>{project.location}</strong>
                  <small>{project.year}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="project-stats-section">
        <div className="container">
          <div className="project-stats-grid">
            {stats.map((stat) => (
              <div className="project-stat-item" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-cta-section">
        <div className="container">
          <div className="projects-cta-panel">
            <div>
              <span className="cf-eyebrow">Have a Similar Project?</span>
              <h2>Mari diskusikan kebutuhan infrastruktur Anda.</h2>
              <p>
                Ceritakan skala project, lokasi, jumlah user, dan kebutuhan
                jaringan Anda. Tim kami bantu susun solusi terbaik.
              </p>
            </div>

            <Link href="/booking" className="btn btn-warning btn-lg">
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}