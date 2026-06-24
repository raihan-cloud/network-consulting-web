"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-dark text-white py-5 py-lg-6 position-relative overflow-hidden">
      {/* Background Image - Network/Server Room */}
      <div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      ></div>

      {/* Dark overlay untuk memastikan teks tetap terbaca */}
      <div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(15, 15, 25, 0.9) 50%, rgba(25, 20, 15, 0.85) 100%)',
          zIndex: 1
        }}
      ></div>

      {/* Grid Pattern Overlay - Lebih subtle */}
      <div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          zIndex: 2
        }}
      ></div>

      <div className="container position-relative" style={{ zIndex: 3 }}>
        <div className="row align-items-center g-5">
          
          {/* LEFT CONTENT */}
          <div className="col-lg-7">
            {/* Badge */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white bg-opacity-5 border border-white border-opacity-10 shadow-sm mb-4">
              <span className="badge bg-warning rounded-pill" style={{ width: '8px', height: '8px', padding: 0 }}></span>
              <span className="text-warning fw-semibold small text-uppercase ls-1">Network Infrastructure Partner</span>
            </div>

            {/* Headline */}
            <h1 className="display-4 fw-bold text-white mb-4 lh-base">
              Membangun jaringan yang <span className="text-warning">stabil, aman</span>, dan siap berkembang.
            </h1>

            {/* Description */}
            <p className="lead text-white text-opacity-70 mb-5 pe-lg-5">
              NetPro membantu bisnis, sekolah, instansi, dan organisasi membangun infrastruktur jaringan, fiber optik, MikroTik, CCTV, server, dan konsultasi IT secara profesional.
            </p>

            {/* CTA Buttons - Tanpa biru */}
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <Link 
                href="/booking" 
                className="btn btn-warning btn-lg px-5 py-3 fw-semibold shadow-sm text-dark"
              >
                Konsultasi Sekarang
              </Link>
              <Link 
                href="/services" 
                className="btn btn-outline-light btn-lg px-4 py-3 fw-medium d-inline-flex align-items-center gap-2 hover-btn"
              >
                Lihat layanan 
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-5 pt-4 border-top border-white border-opacity-10">
              <p className="text-white text-opacity-50 small mb-3">Dipercaya oleh 100+ klien di Indonesia</p>
              <div className="d-flex gap-4 text-white text-opacity-40">
                <div className="fw-bold">TELKOM</div>
                <div className="fw-bold">INDOSAT</div>
                <div className="fw-bold">XL AXIATA</div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Network Panel */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              {/* Card Header */}
              <div className="card-header bg-white border-bottom border-secondary-subtle py-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex gap-2">
                    <div className="rounded-circle bg-danger" style={{ width: '12px', height: '12px' }}></div>
                    <div className="rounded-circle bg-warning" style={{ width: '12px', height: '12px' }}></div>
                    <div className="rounded-circle bg-success" style={{ width: '12px', height: '12px' }}></div>
                  </div>
                  <small className="text-muted font-monospace">network-monitor://active</small>
                </div>
              </div>

              {/* Card Body - Network Topology */}
              <div className="card-body bg-light p-4">
                <div className="position-relative" style={{ height: '280px' }}>
                  {/* SVG Network Topology */}
                  <svg className="position-absolute w-100 h-100" viewBox="0 0 400 280">
                    {/* Connection Lines - Tanpa biru, pakai abu-abu */}
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6c757d" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#495057" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    
                    {/* Lines */}
                    <line x1="200" y1="140" x2="100" y2="70" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse"/>
                    <line x1="200" y1="140" x2="300" y2="70" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse"/>
                    <line x1="200" y1="140" x2="100" y2="210" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse"/>
                    <line x1="200" y1="140" x2="300" y2="210" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse"/>
                    
                    {/* Center Node - CORE - Tanpa biru */}
                    <circle cx="200" cy="140" r="25" fill="white" stroke="#ffc107" strokeWidth="3"/>
                    <text x="200" y="145" textAnchor="middle" fill="#ffc107" fontSize="11" fontWeight="bold">CORE</text>
                    
                    {/* LAN Node */}
                    <circle cx="100" cy="70" r="20" fill="white" stroke="#6c757d" strokeWidth="2"/>
                    <text x="100" y="75" textAnchor="middle" fill="#495057" fontSize="10" fontWeight="600">LAN</text>
                    
                    {/* WAN Node */}
                    <circle cx="300" cy="70" r="20" fill="white" stroke="#6c757d" strokeWidth="2"/>
                    <text x="300" y="75" textAnchor="middle" fill="#495057" fontSize="10" fontWeight="600">WAN</text>
                    
                    {/* CCTV Node */}
                    <circle cx="100" cy="210" r="20" fill="white" stroke="#6c757d" strokeWidth="2"/>
                    <text x="100" y="215" textAnchor="middle" fill="#495057" fontSize="10" fontWeight="600">CCTV</text>
                    
                    {/* SERVER Node */}
                    <circle cx="300" cy="210" r="20" fill="white" stroke="#6c757d" strokeWidth="2"/>
                    <text x="300" y="215" textAnchor="middle" fill="#495057" fontSize="9" fontWeight="600">SERVER</text>
                  </svg>
                </div>
              </div>

              {/* Card Footer - Stats */}
              <div className="card-footer bg-white border-top border-secondary-subtle py-3">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success bg-opacity-10 rounded-3 p-2">
                        <i className="bi bi-shield-check text-success fs-5"></i>
                      </div>
                      <div>
                        <div className="h5 mb-0 fw-bold text-dark">99.9%</div>
                        <small className="text-muted">Uptime</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-warning bg-opacity-10 rounded-3 p-2">
                        <i className="bi bi-headset text-warning fs-5"></i>
                      </div>
                      <div>
                        <div className="h5 mb-0 fw-bold text-dark">24/7</div>
                        <small className="text-muted">Support</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Custom CSS untuk animasi dan styling tambahan */}
      <style jsx>{`
        .ls-1 {
          letter-spacing: 1px;
        }
        
        .hover-btn:hover {
          transform: translateX(5px);
          transition: all 0.3s ease;
        }
        
        .hover-btn i {
          transition: transform 0.3s ease;
        }
        
        .hover-btn:hover i {
          transform: translateX(3px);
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }

        .animate-pulse {
          animation: dash 1s linear infinite;
        }
      `}</style>
    </section>
  );
}