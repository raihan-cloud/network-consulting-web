import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <section className="project-detail-hero">
        <div className="container">
          <span className="cf-eyebrow">Case Study</span>

          <h1>{project.title}</h1>

          <p>{project.summary}</p>

          <div className="project-detail-meta">
            <div>
              <span>Category</span>
              <strong>{project.category}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{project.location}</strong>
            </div>

            <div>
              <span>Year</span>
              <strong>{project.year}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="project-detail-body">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <div className="project-detail-block">
                <span className="cf-eyebrow">Challenge</span>
                <h2>Tantangan project</h2>
                <p>{project.challenge}</p>
              </div>

              <div className="project-detail-block">
                <span className="cf-eyebrow">Solution</span>
                <h2>Solusi yang diterapkan</h2>
                <p>{project.solution}</p>
              </div>

              <div className="project-detail-block">
                <span className="cf-eyebrow">Results</span>
                <h2>Hasil implementasi</h2>

                <div className="project-result-list">
                  {project.results.map((result) => (
                    <div key={result}>
                      <i className="bi bi-check2-circle"></i>
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <aside className="project-detail-side">
                <h3>Project Specs</h3>

                <div className="project-spec-list">
                  {project.specs.map((spec) => (
                    <span key={spec}>{spec}</span>
                  ))}
                </div>

                <hr />

                <h3>Need Similar Project?</h3>

                <p>
                  Diskusikan kebutuhan infrastruktur jaringan Anda bersama tim
                  NetPro.
                </p>

                <Link href="/booking" className="btn btn-warning w-100">
                  Booking Consultation
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="projects-cta-section">
        <div className="container">
          <div className="projects-cta-panel">
            <div>
              <span className="cf-eyebrow">Start Your Project</span>
              <h2>Ingin membuat project seperti ini?</h2>
              <p>
                Ceritakan lokasi, jumlah user, kebutuhan perangkat, dan target
                jaringan Anda. Kami bantu susun rekomendasi solusi.
              </p>
            </div>

            <Link href="/booking" className="btn btn-warning btn-lg">
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}