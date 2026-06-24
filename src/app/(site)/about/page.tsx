import Image from "next/image";
import Link from "next/link";

const leaders = [
  {
    name: "Raihan Muzaffar",
    initials: "RM",
    role: "Founder & Chief Executive Officer",
    image: "/images/team/raihan.jpeg",
    desc: "Berfokus pada strategi bisnis, arsitektur jaringan, pengembangan layanan, dan transformasi infrastruktur digital untuk organisasi modern.",
    skills: ["Network Architecture", "MikroTik", "Proxmox", "IT Strategy"],
  },
  {
    name: "Rezatul maulana",
    initials: "RZ",
    role: "Co-Founder & Chief Technology Officer",
    image: "/images/team/rezatul.jpeg",
    desc: "Berfokus pada implementasi teknis, fiber optik, sistem keamanan, routing, switching, dan manajemen project infrastruktur IT.",
    skills: ["Fiber Optic", "CCTV", "Routing", "Project Deployment"],
  },
];

const values = [
  "Reliable Infrastructure",
  "Clear Documentation",
  "Scalable Network Design",
  "Long-Term Support",
];

const stats = [
  { value: "50+", label: "Project handled" },
  { value: "1000+", label: "Connected devices" },
  { value: "99%", label: "Target availability" },
  { value: "24/7", label: "Support ready" },
];

export default function AboutPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="container">
          <span className="cf-eyebrow">About NetPro</span>
          <h1>Building reliable infrastructure for modern organizations.</h1>
          <p>
            NetPro membantu bisnis, sekolah, kampus, instansi, dan organisasi
            membangun infrastruktur jaringan yang stabil, aman, dan siap
            berkembang.
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="about-story-grid">
            <div>
              <span className="cf-eyebrow">Who We Are</span>
              <h2>Mitra teknologi untuk instalasi jaringan dan konsultasi IT.</h2>
            </div>

            <div>
              <p>
                NetPro adalah perusahaan yang berfokus pada jasa instalasi
                jaringan, MikroTik, fiber optik, CCTV, server, virtualisasi, dan
                konsultasi infrastruktur IT.
              </p>

              <p>
                Kami tidak hanya memasang perangkat, tetapi membantu merancang
                fondasi infrastruktur digital yang mudah dikelola, aman,
                terdokumentasi, dan siap dikembangkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="leadership-section">
        <div className="container">
          <div className="about-section-header">
            <span className="cf-eyebrow">Leadership Team</span>
            <h2>Dua pemimpin dengan fokus pada strategi dan implementasi.</h2>
          </div>

          <div className="leadership-grid">
            {leaders.map((leader) => (
              <article className="leader-card" key={leader.name}>
                <div className="leader-photo">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    width={360}
                    height={420}
                    className="leader-image"
                  />

                  <div className="leader-photo-fallback">
                    {leader.initials}
                  </div>
                </div>

                <div className="leader-content">
                  <span>{leader.role}</span>
                  <h3>{leader.name}</h3>
                  <p>{leader.desc}</p>

                  <div className="leader-skills">
                    {leader.skills.map((skill) => (
                      <small key={skill}>{skill}</small>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <div className="about-values-panel">
            <div>
              <span className="cf-eyebrow">Our Mission</span>
              <h2>Menyediakan solusi jaringan yang andal, aman, dan scalable.</h2>
              <p>
                Kami ingin membantu organisasi memiliki infrastruktur IT yang
                tidak hanya berjalan, tetapi juga mudah dipantau, mudah
                dikembangkan, dan siap mendukung pertumbuhan bisnis.
              </p>
            </div>

            <div className="value-list">
              {values.map((value) => (
                <div className="value-item" key={value}>
                  <i className="bi bi-check2-circle"></i>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((stat) => (
              <div className="about-stat-item" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <div className="about-cta-panel">
            <div>
              <span className="cf-eyebrow">Work With Us</span>
              <h2>Butuh partner IT untuk membangun jaringan yang lebih stabil?</h2>
              <p>
                Diskusikan kebutuhan jaringan, server, CCTV, fiber optik, atau
                konsultasi IT bersama tim NetPro.
              </p>
            </div>

            <Link href="/booking" className="btn btn-warning btn-lg">
              Jadwalkan Konsultasi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}