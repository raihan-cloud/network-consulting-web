export default function AdminSettingsPage() {
  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Settings</span>
          <h1>System Settings</h1>
        </div>

        <button className="btn btn-warning">
          <i className="bi bi-save me-2"></i>
          Save Settings
        </button>
      </div>

      <div className="admin-settings-layout">
        <div className="admin-settings-main">
          <div className="admin-settings-panel">
            <div className="admin-panel-header">
              <div>
                <span>Company</span>
                <h2>Company profile</h2>
              </div>
            </div>

            <div className="admin-settings-grid">
              <div>
                <label className="form-label">Company Name</label>
                <input className="form-control" defaultValue="NetPro" />
              </div>

              <div>
                <label className="form-label">Business Email</label>
                <input
                  className="form-control"
                  defaultValue="netpro@email.com"
                />
              </div>

              <div>
                <label className="form-label">WhatsApp Number</label>
                <input
                  className="form-control"
                  defaultValue="+62 812 xxxx xxxx"
                />
              </div>

              <div>
                <label className="form-label">Location</label>
                <input className="form-control" defaultValue="Aceh, Indonesia" />
              </div>
            </div>
          </div>

          <div className="admin-settings-panel">
            <div className="admin-panel-header">
              <div>
                <span>Operations</span>
                <h2>Booking & project rules</h2>
              </div>
            </div>

            <div className="admin-settings-grid">
              <div>
                <label className="form-label">Default Response Time</label>
                <select className="form-select" defaultValue="1x24">
                  <option value="1x24">1 x 24 Jam</option>
                  <option value="2x24">2 x 24 Jam</option>
                  <option value="same-day">Same Day</option>
                </select>
              </div>

              <div>
                <label className="form-label">Default Booking Status</label>
                <select className="form-select" defaultValue="pending">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="review">Need Review</option>
                </select>
              </div>

              <div>
                <label className="form-label">Default Currency</label>
                <select className="form-select" defaultValue="idr">
                  <option value="idr">IDR - Rupiah</option>
                  <option value="usd">USD - Dollar</option>
                </select>
              </div>

              <div>
                <label className="form-label">Invoice Prefix</label>
                <input className="form-control" defaultValue="INV-2026" />
              </div>
            </div>
          </div>

          <div className="admin-settings-panel">
            <div className="admin-panel-header">
              <div>
                <span>Notifications</span>
                <h2>Admin notification rules</h2>
              </div>
            </div>

            <div className="admin-settings-toggle-list">
              <div className="admin-settings-toggle">
                <div>
                  <strong>New booking alert</strong>
                  <p>Kirim notifikasi saat ada booking baru masuk.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="admin-settings-toggle">
                <div>
                  <strong>Invoice payment reminder</strong>
                  <p>Kirim pengingat untuk invoice yang belum dibayar.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="admin-settings-toggle">
                <div>
                  <strong>Support ticket alert</strong>
                  <p>Kirim notifikasi saat client membuat ticket support.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="admin-settings-toggle">
                <div>
                  <strong>Project deadline warning</strong>
                  <p>Tampilkan peringatan project mendekati deadline.</p>
                </div>
                <input type="checkbox" />
              </div>
            </div>
          </div>
        </div>

        <aside className="admin-settings-side">
          <div className="admin-settings-side-card">
            <h3>System Status</h3>

            <div className="admin-system-status">
              <span></span>
              Operational
            </div>

            <p>
              Semua layanan frontend berjalan normal. Integrasi Firebase,
              Firestore, Storage, dan payment gateway akan ditambahkan pada
              tahap backend.
            </p>
          </div>

          <div className="admin-settings-side-card">
            <h3>Next Integration</h3>

            <ul>
              <li>Firebase Authentication</li>
              <li>Firestore Database</li>
              <li>Firebase Storage</li>
              <li>Admin / Client Role</li>
              <li>Midtrans atau Xendit</li>
            </ul>
          </div>

          <div className="admin-settings-side-card danger-card">
            <h3>Danger Zone</h3>

            <p>
              Area ini nanti digunakan untuk reset konfigurasi, export data,
              atau maintenance mode.
            </p>

            <button className="btn btn-outline-danger w-100">
              Maintenance Mode
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}