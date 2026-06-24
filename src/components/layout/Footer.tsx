import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-top">
          <div>
            <h2>Bangun infrastruktur jaringan yang lebih stabil.</h2>
            <p>
              Konsultasikan kebutuhan instalasi jaringan, MikroTik, fiber optik,
              CCTV, server, dan maintenance IT bersama tim kami.
            </p>
          </div>

          <Link href="/booking" className="btn btn-warning footer-cta">
            Free Consultation
          </Link>
        </div>

        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">
                <i className="bi bi-diagram-3-fill"></i>
              </span>

              <div>
                <h5>NetPro</h5>
                <small>Network Infrastructure Partner</small>
              </div>
            </div>

            <p>
              Penyedia jasa instalasi jaringan, konsultasi infrastruktur IT,
              MikroTik, fiber optik, CCTV, server, dan maintenance jaringan.
            </p>

            <div className="footer-social">
              <Link href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </Link>
              <Link href="#" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </Link>
              <Link href="#" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </Link>
            </div>
          </div>

          <div>
            <h6>Services</h6>
            <ul className="footer-links">
              <li><Link href="/services/network-infrastructure">Network Infrastructure</Link></li>
              <li><Link href="/services/fiber-optic">Fiber Optic Deployment</Link></li>
              <li><Link href="/services/mikrotik">MikroTik & Routing</Link></li>
              <li><Link href="/services/cctv">Security & CCTV</Link></li>
              <li><Link href="/services/server">Server & Virtualization</Link></li>
            </ul>
          </div>

          <div>
            <h6>Company</h6>
            <ul className="footer-links">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/portfolio">Projects</Link></li>
              <li><Link href="/solutions">Solutions</Link></li>
              <li><Link href="/support">Support</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h6>Contact</h6>
            <ul className="footer-contact">
              <li>
                <i className="bi bi-geo-alt"></i>
                Aceh, Indonesia
              </li>
              <li>
                <i className="bi bi-envelope"></i>
                netpro@email.com
              </li>
              <li>
                <i className="bi bi-telephone"></i>
                +62 812 xxxx xxxx
              </li>
              <li>
                <i className="bi bi-clock"></i>
                Mon - Sat, 09.00 - 18.00
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <small>© 2026 NetPro. All rights reserved.</small>
          <small>Network Infrastructure & IT Consultant</small>
        </div>
      </div>
    </footer>
  );
}