const technologies = [
  "MikroTik",
  "Cisco",
  "Ubiquiti",
  "Huawei",
  "Fortinet",
  "Proxmox",
  "VMware",
  "TP-Link Omada",
];

export default function TechnologyPartners() {
  return (
    <section className="stats-cta-section reveal-up">
      <div className="container">
        <div className="technology-header">
          <span className="cf-eyebrow">Trusted Technologies</span>
          <h2>Teknologi yang kami gunakan dalam implementasi jaringan.</h2>
        </div>

        <div className="technology-grid">
          {technologies.map((tech) => (
            <div className="technology-item" key={tech}>
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}