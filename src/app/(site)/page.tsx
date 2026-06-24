import HeroSection from "@/components/home/HeroSection";
import ServiceCategories from "@/components/home/ServiceCategories";
import FeaturedSolutions from "@/components/home/FeaturedSolutions";
import InfrastructureShowcase from "@/components/home/InfrastructureShowcase";
import TechnologyPartners from "@/components/home/TechnologyPartners";
import StatsCTA from "@/components/home/StatsCTA";

export default function HomePage() {
  return (
    <main>

      <HeroSection />

      <ServiceCategories />

      <FeaturedSolutions />

      <InfrastructureShowcase />

      <TechnologyPartners />

      <StatsCTA />

    </main>
  );
}