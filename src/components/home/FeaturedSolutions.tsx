const solutions = [
  "Office Network Setup",
  "School & Campus WiFi",
  "Fiber Optic Backbone",
  "CCTV Over Network",
  "MikroTik Hotspot System",
  "Server & Private Cloud",
];

export default function FeaturedSolutions() {
  return (
   <section className="featured-solutions reveal-up">
      <div className="container">
        <div className="solution-panel">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="cf-eyebrow">Solutions</span>
              <h2>
                Solusi jaringan untuk kantor, sekolah, kampus, dan bisnis.
              </h2>
              <p>
                Kami merancang infrastruktur berdasarkan kebutuhan operasional,
                jumlah user, keamanan, bandwidth, dan rencana pengembangan.
              </p>
            </div>

            <div className="col-lg-7">
              <div className="solution-list">
                {solutions.map((item) => (
                  <div className="solution-row" key={item}>
                    <span>{item}</span>
                    <i className="bi bi-check2-circle"></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}