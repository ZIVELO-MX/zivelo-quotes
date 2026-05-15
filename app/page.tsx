import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero"
import { ProblemSection } from "@/components/landing/problem"
import { SolutionSection } from "@/components/landing/solution"
import { FeaturesSection } from "@/components/landing/features"
import { CTASection } from "@/components/landing/cta"
import { FutureSection } from "@/components/landing/future"

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <FutureSection />
      <CTASection />
      <Footer />
    </main>
  )
}
