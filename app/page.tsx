import RevealObserver from "@/components/RevealObserver";
import HeroSection from "@/components/HeroSection";
import ExperienceAndFocus from "@/components/ExperienceAndFocus";
import CasesShowcase from "@/components/CasesShowcase";
import ParticleWaveFooter from "@/components/ParticleWaveFooter";

export default function Home() {
  return (
    <>
      <a href="#cases" className="sr-only">
        Skip to cases
      </a>
      <RevealObserver />
      <main>
        <HeroSection />
        <ExperienceAndFocus />
        <CasesShowcase />
        <ParticleWaveFooter />
      </main>
    </>
  );
}
