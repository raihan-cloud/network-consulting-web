import Link from "next/link";

export default function ConsultationSuccessPage() {
  return (
    <main>
      <section className="booking-success-modern">
        <div className="container">
          <div className="success-modern-layout">
            <div className="success-modern-card">
              <div className="success-status">
                <span className="success-pulse"></span>
                Consultation request received
              </div>

              <div className="success-modern-icon">
                <i className="bi bi-chat-dots"></i>
              </div>

              <h1>Konsultasi berhasil dikirim.</h1>

              <p>
                Terima kasih. Tim NetPro akan meninjau kebutuhan jaringan Anda
                dan menghubungi melalui WhatsApp atau email untuk diskusi awal,
                rekomendasi solusi, dan estimasi layanan.
              </p>

              <div className="success-modern-actions">
                <Link href="/services" className="btn btn-outline-primary btn-lg">
                  Lihat Layanan
                </Link>

                <Link href="/dashboard" className="btn btn-warning btn-lg">
                  Buka Dashboard
                </Link>
              </div>
            </div>

            <aside className="success-summary-panel">
              <div className="success-summary-header">
                <span>Consultation Summary</span>
                <strong>#CS-2026-0001</strong>
              </div>

              <div className="success-timeline">
                <div className="success-timeline-item active">
                  <span></span>
                  <div>
                    <strong>Konsultasi diterima</strong>
                    <small>Permintaan konsultasi Anda sudah masuk ke sistem.</small>
                  </div>
                </div>

                <div className="success-timeline-item">
                  <span></span>
                  <div>
                    <strong>Review kebutuhan</strong>
                    <small>Tim NetPro akan meninjau detail kebutuhan Anda.</small>
                  </div>
                </div>

                <div className="success-timeline-item">
                  <span></span>
                  <div>
                    <strong>Dihubungi tim</strong>
                    <small>Kami akan menghubungi Anda maksimal 1 x 24 jam.</small>
                  </div>
                </div>
              </div>

              <div className="success-summary-grid">
                <div>
                  <span>Status</span>
                  <strong>New</strong>
                </div>
                <div>
                  <span>Response</span>
                  <strong>1 x 24 Jam</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <strong>Gratis</strong>
                </div>
                <div>
                  <span>Channel</span>
                  <strong>WhatsApp / Email</strong>
                </div>
              </div>

              <div className="success-help-box">
                <i className="bi bi-info-circle"></i>
                <p>
                  Konsultasi awal tidak membutuhkan pembayaran. Tim NetPro akan
                  menghubungi Anda untuk diskusi kebutuhan dan rekomendasi solusi.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}