export default function DashboardProfilePage() {
  return (
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Profile</span>
          <h1>Account Profile</h1>
        </div>

        <button className="btn btn-warning">
          <i className="bi bi-pencil-square me-2"></i>
          Edit Profile
        </button>
      </div>

      <div className="profile-layout">
        <aside className="profile-card">
          <div className="profile-avatar">R</div>

          <h2>Raihan Muzaffar</h2>
          <p>Client Account</p>

          <div className="profile-status">
            <i className="bi bi-check2-circle"></i>
            Verified Client
          </div>

          <div className="profile-summary-list">
            <div>
              <span>Company</span>
              <strong>NetPro Client</strong>
            </div>

            <div>
              <span>Member Since</span>
              <strong>June 2026</strong>
            </div>

            <div>
              <span>Client ID</span>
              <strong>CLT-2026-001</strong>
            </div>
          </div>
        </aside>

        <div className="profile-main">
          <div className="profile-panel">
            <div className="client-panel-header">
              <div>
                <span>Personal Information</span>
                <h2>Data akun</h2>
              </div>
            </div>

            <div className="profile-info-grid">
              <div>
                <span>Full Name</span>
                <strong>Raihan Muzaffar</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>raihan@example.com</strong>
              </div>

              <div>
                <span>WhatsApp</span>
                <strong>+62 812 xxxx xxxx</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>Client</strong>
              </div>
            </div>
          </div>

          <div className="profile-panel">
            <div className="client-panel-header">
              <div>
                <span>Organization</span>
                <h2>Informasi bisnis / instansi</h2>
              </div>
            </div>

            <div className="profile-info-grid">
              <div>
                <span>Organization Name</span>
                <strong>Personal / Business</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>Aceh, Indonesia</strong>
              </div>

              <div>
                <span>Industry</span>
                <strong>Network Infrastructure</strong>
              </div>

              <div>
                <span>Account Type</span>
                <strong>Standard Client</strong>
              </div>
            </div>
          </div>

          <div className="profile-panel">
            <div className="client-panel-header">
              <div>
                <span>Activity Summary</span>
                <h2>Ringkasan aktivitas</h2>
              </div>
            </div>

            <div className="profile-activity-grid">
              <div>
                <strong>3</strong>
                <span>Total Bookings</span>
              </div>

              <div>
                <strong>2</strong>
                <span>Active Projects</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Invoices</span>
              </div>

              <div>
                <strong>0</strong>
                <span>Open Tickets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}