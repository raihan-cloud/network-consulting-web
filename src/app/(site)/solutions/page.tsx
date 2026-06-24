import Link from "next/link";

const solutions = [
  {
    icon: "bi-building",
    title: "Office Network",
    desc: "Solusi jaringan kantor untuk operasional bisnis, meeting room, user internal, guest WiFi, dan monitoring.",
    points: ["LAN/WAN", "Guest WiFi", "VPN Access"],
  },
  {
    icon: "bi-mortarboard",
    title: "School & Campus",
    desc: "Infrastruktur jaringan untuk sekolah, kampus, lab komputer, e-learning, hotspot, dan akses internet terkontrol.",
    points: ["WiFi Area", "Lab Network", "User Management"],
  },
  {
    icon: "bi-shop",
    title: "Retail & Cafe",
    desc: "Jaringan untuk kasir POS, WiFi pelanggan, CCTV, inventory system, dan koneksi internet yang stabil.",
    points: ["POS Network", "Customer WiFi", "CCTV"],
  },
  {
    icon: "bi-hospital",
    title: "Hospitality & Public Area",
    desc: "Solusi jaringan untuk hotel, penginapan, ruang publik, guest WiFi, dan sistem keamanan berbasis jaringan.",
    points: ["Guest Portal", "Multi Floor WiFi", "NVR"],
  },
  {
    icon: "bi-box-seam",
    title: "Warehouse & Industrial",
    desc: "Jaringan untuk gudang, pabrik, area produksi, monitoring perangkat, CCTV, dan koneksi antar area.",
    points: ["Backbone", "Monitoring", "Industrial CCTV"],
  },
  {
    icon: "bi-shield-lock",
    title: "Security Surveillance",
    desc: "Solusi keamanan berbasis CCTV, IP camera, NVR, remote monitoring, dan segmentasi jaringan kamera.",
    points: ["IP Camera", "Remote View", "Secure VLAN"],
  },
];

const capabilities = [
  "Network assessment",
  "Topology design",
  "VLAN segmentation",
  "Firewall policy",
  "Bandwidth management",
  "Device monitoring",
  "VPN access",
  "Documentation",
];

const process = [
  "Assessment",
  "Solution Design",
  "Deployment",
  "Testing",
  "Support",
];

export default function SolutionsPage() {
  return (
    <main>
      <section className="solutions-hero">
        <div className="container">
          <span className="cf-eyebrow">Business Solutions</span>

          <h1>Solusi jaringan yang dirancang berdasarkan kebutuhan bisnis.</h1>

          <p>
            Kami membantu kantor, sekolah, kampus, retail, gudang, dan instansi
            membangun infrastruktur jaringan yang stabil, aman, dan mudah
            dikembangkan.
          </p>
        </div>
      </section>

      <section className="solutions-industry">
        <div className="container">
          <div className="solutions-header">
            <div>
              <span className="cf-eyebrow">Industry Solutions</span>
              <h2>Solusi untuk berbagai jenis organisasi.</h2>
            </div>

            <p>
              Setiap lingkungan memiliki kebutuhan yang berbeda. Karena itu,
              desain jaringan harus disesuaikan dengan jumlah user, area,
              keamanan, bandwidth, dan rencana pengembangan.
            </p>
          </div>

          <div className="solutions-grid">
            {solutions.map((solution) => (
              <article className="solution-card" key={solution.title}>
                <div className="solution-icon">
                  <i className={`bi ${solution.icon}`}></i>
                </div>

                <h3>{solution.title}</h3>
                <p>{solution.desc}</p>

                <div className="solution-points">
                  {solution.points.map((point) => (
                    <span key={point}>{point}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-network-solution">
        <div className="container">
          <div className="featured-solution-panel">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5">
                <span className="cf-eyebrow">Featured Solution</span>

                <h2>Enterprise Office Network</h2>

                <p>
                  Solusi jaringan kantor modern dengan core router, switch
                  distribusi, access point, VLAN, firewall, VPN, dan monitoring
                  terpusat.
                </p>

                <div className="featured-capabilities">
                  {capabilities.map((item) => (
                    <div key={item}>
                      <i className="bi bi-check2-circle"></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-7">
                <div className="solution-topology">
                  <div className="topology-node internet">
                    <i className="bi bi-globe2"></i>
                    <span>Internet</span>
                  </div>

                  <div className="topology-node router">
                    <i className="bi bi-router"></i>
                    <span>Core Router</span>
                  </div>

                  <div className="topology-node switch">
                    <i className="bi bi-hdd-network"></i>
                    <span>Distribution Switch</span>
                  </div>

                  <div className="topology-node ap">
                    <i className="bi bi-wifi"></i>
                    <span>Access Point</span>
                  </div>

                  <div className="topology-node users">
                    <i className="bi bi-people"></i>
                    <span>Users</span>
                  </div>

                  <div className="topology-node server">
                    <i className="bi bi-server"></i>
                    <span>Server</span>
                  </div>

                  <div className="topology-line tl1"></div>
                  <div className="topology-line tl2"></div>
                  <div className="topology-line tl3"></div>
                  <div className="topology-line tl4"></div>
                  <div className="topology-line tl5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="solution-process-section">
        <div className="container">
          <div className="solutions-header">
            <div>
              <span className="cf-eyebrow">Implementation Process</span>
              <h2>Dari analisis kebutuhan sampai support.</h2>
            </div>

            <p>
              Kami menggunakan proses kerja bertahap agar implementasi jaringan
              lebih terukur, terdokumentasi, dan mudah dikembangkan.
            </p>
          </div>

          <div className="solution-process-grid">
            {process.map((item, index) => (
              <div className="solution-process-item" key={item}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="solutions-cta-section">
        <div className="container">
          <div className="solutions-cta-panel">
            <div>
              <span className="cf-eyebrow">Custom Solution</span>
              <h2>Butuh solusi jaringan yang disesuaikan?</h2>
              <p>
                Ceritakan kondisi jaringan, jumlah user, lokasi, dan kebutuhan
                bisnis Anda. Kami bantu susun solusi yang paling sesuai.
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