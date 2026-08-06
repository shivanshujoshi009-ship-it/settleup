import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import TrustedCompanies from "@/components/sections/TrustedCompanies";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Stats from "@/components/sections/Stats";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] overflow-x-hidden">

      {/* Background Glow */}
      <AnimatedBackground />

      <Navbar />

      <Hero />

      <TrustedCompanies />

      <Features />

      <HowItWorks />

      <Stats />

      <Footer />

    </main>
  );
}
