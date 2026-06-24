import Link from "next/link";

export default function AdminNavbar() {
  return (
    <header className="admin-topbar">
      <div>
        <span className="admin-page-label">Network Operations Center</span>
        <h1>Admin Overview</h1>
      </div>

      <div className="admin-topbar-actions">
        <button className="admin-search">
          <i className="bi bi-search"></i>
          Search operations...
        </button>

        <Link href="/" className="btn btn-light">
          View Site
        </Link>
      </div>
    </header>
  );
}