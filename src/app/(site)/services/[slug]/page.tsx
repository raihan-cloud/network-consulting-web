import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/services";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;

  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <section className="service-detail-hero">
        <div className="container">
          <span className="cf-eyebrow">Service Detail</span>

          <h1>{service.title}</h1>

          <p>{service.description}</p>

          <div className="mt-4">
            <Link
              href={`/booking?service=${service.slug}`}
              className="btn btn-warning btn-lg"
            >
              Booking Layanan Ini
            </Link>
          </div>
        </div>
      </section>

      <section className="service-detail-body">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <h2>Apa saja yang dikerjakan?</h2>

              <div className="detail-list">
                {service.points.map((point) => (
                  <div className="detail-list-item" key={point}>
                    <i className="bi bi-check2-circle"></i>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="detail-side-card">
                <h3>Cocok untuk</h3>

                <div className="detail-tags">
                  {service.suitableFor.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <hr />

                <h3>Teknologi</h3>

                <div className="detail-tags">
                  {service.technologies.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-cta">
        <div className="container">
          <div className="services-cta-panel">
            <div>
              <span className="cf-eyebrow">Need Consultation?</span>

              <h2>Ingin konsultasi sebelum menentukan layanan?</h2>

              <p>
                Ceritakan kebutuhan jaringan Anda, kami bantu berikan arahan
                solusi yang sesuai.
              </p>
            </div>

            <Link
              href={`/booking?service=${service.slug}`}
              className="btn btn-warning btn-lg"
            >
              Jadwalkan Konsultasi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}