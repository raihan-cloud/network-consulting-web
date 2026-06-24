import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <main>
      <section className="booking-success-modern">
        <div className="container">
          <div className="success-modern-layout">
            <div className="success-modern-card">
              <div className="success-status">
                <span className="success-pulse"></span>
                Booking request received
              </div>

              <div className="success-modern-icon">
                <i className="bi bi-check2"></i>
              </div>

              <h1>Booking berhasil dikirim.</h1>

              <p>
                Terima kasih. Tim NetPro akan meninjau kebutuhan Anda dan
                menghubungi melalui WhatsApp atau email untuk konfirmasi jadwal,
                layanan, dan estimasi biaya.
              </p>

              <div className="success-modern-actions">
                <Link href="/services" className="btn btn-outline-primary btn-lg">
                  Lihat Layanan
                </Link>

                <Link href="/" className="btn btn-warning btn-lg">
                  Kembali ke Home
                </Link>
              </div>
            </div>

            <aside className="success-summary-panel">
              <div className="success-summary-header">
                <span>Booking Summary</span>
                <strong>#BK-2026-0001</strong>
              </div>

              <div className="success-timeline">
                <div className="success-timeline-item active">
                  <span></span>
                  <div>
                    <strong>Booking diterima</strong>
                    <small>Permintaan Anda sudah masuk ke sistem.</small>
                  </div>
                </div>

                <div className="success-timeline-item">
                  <span></span>
                  <div>
                    <strong>Menunggu konfirmasi</strong>
                    <small>Tim kami akan menghubungi Anda maksimal 1 x 24 jam.</small>
                  </div>
                </div>

                <div className="success-timeline-item">
                  <span></span>
                  <div>
                    <strong>Invoice / pembayaran</strong>
                    <small>Payment link dibuat setelah layanan dikonfirmasi.</small>
                  </div>
                </div>
              </div>

              <div className="success-summary-grid">
                <div>
                  <span>Status</span>
                  <strong>Pending</strong>
                </div>
                <div>
                  <span>Response</span>
                  <strong>1 x 24 Jam</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <strong>Belum Dibuat</strong>
                </div>
                <div>
                  <span>Channel</span>
                  <strong>WhatsApp / Email</strong>
                </div>
              </div>

              <div className="success-help-box">
                <i className="bi bi-info-circle"></i>
                <p>
                  Simpan nomor booking ini. Nanti bisa dipakai untuk cek status
                  booking ketika fitur dashboard client sudah tersedia.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}