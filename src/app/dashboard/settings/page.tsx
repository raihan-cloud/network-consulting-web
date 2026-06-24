export default function DashboardSettingsPage() {
  return (
    <section className="client-dashboard-content">
      <div className="client-page-header">
        <div>
          <span>Settings</span>
          <h1>Account Settings</h1>
        </div>

        <button className="btn btn-warning">
          <i className="bi bi-save me-2"></i>
          Save Changes
        </button>
      </div>

      <div className="settings-layout">
        <div className="settings-main">
          <div className="settings-panel">
            <div className="client-panel-header">
              <div>
                <span>Account</span>
                <h2>Account preferences</h2>
              </div>
            </div>

            <div className="settings-form-grid">
              <div>
                <label className="form-label">Display Name</label>
                <input className="form-control" defaultValue="Raihan Muzaffar" />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  className="form-control"
                  defaultValue="raihan@example.com"
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
                <label className="form-label">Timezone</label>
                <select className="form-select" defaultValue="Asia/Jakarta">
                  <option value="Asia/Jakarta">Asia/Jakarta</option>
                  <option value="Asia/Makassar">Asia/Makassar</option>
                  <option value="Asia/Jayapura">Asia/Jayapura</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-panel">
            <div className="client-panel-header">
              <div>
                <span>Notifications</span>
                <h2>Notification settings</h2>
              </div>
            </div>

            <div className="settings-toggle-list">
              <div className="settings-toggle-item">
                <div>
                  <strong>Booking updates</strong>
                  <p>Dapatkan notifikasi saat status booking berubah.</p>
                </div>

                <input type="checkbox" defaultChecked />
              </div>

              <div className="settings-toggle-item">
                <div>
                  <strong>Project progress</strong>
                  <p>Dapatkan update saat progress project diperbarui.</p>
                </div>

                <input type="checkbox" defaultChecked />
              </div>

              <div className="settings-toggle-item">
                <div>
                  <strong>Invoice reminder</strong>
                  <p>Kirim pengingat ketika invoice sudah diterbitkan.</p>
                </div>

                <input type="checkbox" defaultChecked />
              </div>

              <div className="settings-toggle-item">
                <div>
                  <strong>Support ticket reply</strong>
                  <p>Dapatkan notifikasi saat support membalas ticket.</p>
                </div>

                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>

          <div className="settings-panel danger-zone">
            <div className="client-panel-header">
              <div>
                <span>Security</span>
                <h2>Password & security</h2>
              </div>
            </div>

            <div className="settings-form-grid">
              <div>
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password saat ini"
                />
              </div>

              <div>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password baru"
                />
              </div>
            </div>

            <button className="btn btn-outline-primary mt-3">
              Update Password
            </button>
          </div>
        </div>

        <aside className="settings-side">
          <div className="settings-side-card">
            <h3>Account Status</h3>

            <div className="settings-status">
              <i className="bi bi-check2-circle"></i>
              Verified Client
            </div>

            <p>
              Akun Anda sudah terverifikasi sebagai client NetPro. Nanti status
              ini akan terhubung dengan Firebase Authentication.
            </p>
          </div>

          <div className="settings-side-card">
            <h3>Security Tips</h3>

            <ul>
              <li>Gunakan password minimal 8 karakter.</li>
              <li>Jangan bagikan akses akun kepada orang lain.</li>
              <li>Aktifkan notifikasi invoice dan support.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}