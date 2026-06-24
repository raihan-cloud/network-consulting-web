import Link from "next/link";

export default function Navbar() {
  return (
    <header className="mk-header">
      <nav className="navbar navbar-expand-lg mk-navbar">
        <div className="container">

          {/* Logo */}
          <Link href="/" className="mk-brand">
            <span className="mk-logo">
              <i className="bi bi-diagram-3-fill"></i>
            </span>

            <div className="d-flex flex-column">
              <span className="mk-brand-text">
                NetPro
              </span>

              <span className="mk-brand-subtitle">
                Network Infrastructure
              </span>
            </div>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler mk-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div
            className="collapse navbar-collapse"
            id="mainNavbar"
          >
            <ul className="navbar-nav mx-auto mk-menu">

              <li className="nav-item">
                <Link className="nav-link active" href="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" href="/services">
                  Services
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" href="/solutions">
                  Solutions
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" href="/projects">
                  Projects
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" href="/about">
                  Company
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" href="/contact">
                  Contact
                </Link>
              </li>

            </ul>

            <div className="d-flex align-items-center gap-2 mk-actions">
              <Link href="/login" className="btn mk-login-btn">
              <i className="bi bi-person-circle me-2"></i>
               Login
              </Link>

            <Link href="/booking" className="btn btn-warning mk-cta-btn">
            Free Consultation
            </Link>
              </div>

          </div>

        </div>
      </nav>
    </header>
  );
}