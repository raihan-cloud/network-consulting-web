import Link from "next/link";

const categories = [
  {
    title: "Network Infrastructure",
    items: "LAN, WAN, Wireless, Office Network",
    href: "/services/network-infrastructure",
  },
  {
    title: "Fiber Optic Deployment",
    items: "Backbone, ODF, FTTH, Splicing",
    href: "/services/fiber-optic",
  },
  {
    title: "MikroTik & Routing",
    items: "Hotspot, VPN, Firewall, Bandwidth",
    href: "/services/mikrotik",
  },
  {
    title: "Security & CCTV",
    items: "IP Camera, NVR, Remote Monitoring",
    href: "/services/cctv",
  },
  {
    title: "Server & Virtualization",
    items: "Proxmox, NAS, Backup, Private Cloud",
    href: "/services/server",
  },
  {
    title: "IT Consultation",
    items: "Audit, Design, Upgrade, Maintenance",
    href: "/services/consultation",
  },
];

export default function ServiceCategories() {
  return (
    <section className="service-category-section reveal-up">
      <div className="container">
        <div className="service-category-header">
          <div>
            <span className="cf-eyebrow">What we do</span>
            <h2>Layanan infrastruktur untuk kebutuhan jaringan modern.</h2>
          </div>
          <p>
            Dari perencanaan, instalasi, konfigurasi, dokumentasi, hingga
            maintenance jaringan untuk bisnis, sekolah, kampus, dan instansi.
          </p>
        </div>

        <div className="service-category-grid">
          {categories.map((category) => (
            <Link href={category.href} className="service-category-item" key={category.title}>
              <div>
                <h3>{category.title}</h3>
                <p>{category.items}</p>
              </div>
              <i className="bi bi-arrow-right"></i>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}