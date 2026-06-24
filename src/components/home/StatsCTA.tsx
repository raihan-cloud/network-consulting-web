import Link from "next/link";

const stats = [
  {
    value: "50+",
    label: "Project jaringan ditangani",
  },
  {
    value: "20+",
    label: "Client dan organisasi",
  },
  {
    value: "99%",
    label: "Target stabilitas jaringan",
  },
  {
    value: "24/7",
    label: "Support remote & onsite",
  },
];

export default function StatsCTA() {
  return (
    <section className="stats-cta-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="cta-panel">
          <div>
            <span className="cf-eyebrow">Start Your Project</span>
            <h2>Siap membangun infrastruktur jaringan yang lebih stabil?</h2>
            <p>
              Diskusikan kebutuhan jaringan, CCTV, fiber optik, server, atau
              sistem MikroTik bisnis Anda bersama tim kami.
            </p>
          </div>

          <Link href="/booking" className="btn btn-primary btn-lg">
            Jadwalkan Konsultasi
          </Link>
        </div>
      </div>
    </section>
  );
}