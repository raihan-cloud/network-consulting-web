export default function InfrastructureShowcase() {
  return (
    <section className="infra-showcase reveal-up">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5">
            <span className="cf-eyebrow">Infrastructure Design</span>

            <h2>
              Satu arsitektur jaringan untuk seluruh kebutuhan operasional.
            </h2>

            <p>
              Kami merancang jaringan yang terstruktur dari core router,
              switch distribusi, access point, CCTV, server, hingga monitoring.
              Setiap instalasi dibuat agar mudah dikembangkan dan mudah
              ditroubleshooting.
            </p>

            <ul className="infra-points">
              <li>Segmentasi VLAN untuk user, CCTV, server, dan tamu.</li>
              <li>Bandwidth management dan firewall policy.</li>
              <li>Monitoring perangkat jaringan secara terpusat.</li>
            </ul>
          </div>

          <div className="col-lg-7">
            <div className="infra-map">
              <img 
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop" 
                alt="Network Topology Diagram" 
                className="topology-image"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .infra-map {
          position: relative;
          width: 100%;
          background: #f8f9fb;
          border-radius: 16px;
          border: 1px solid #e9ecf1;
          overflow: hidden;
          padding: 20px;
        }

        .topology-image {
          width: 100%;
          height: auto;
          max-height: 500px;
          object-fit: contain;
          object-position: center;
          display: block;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .topology-image {
            max-height: 350px;
          }
        }
      `}</style>
    </section>
  );
}