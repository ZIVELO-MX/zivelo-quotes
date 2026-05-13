import { Header } from "@/components/header"
import { HeroSection } from "@/components/sections/hero"
import { ProblemSection } from "@/components/sections/problem"
import { SolutionSection } from "@/components/sections/solution"
import { FeaturesSection } from "@/components/sections/features"
import { CTASection } from "@/components/sections/cta"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/app/language-provider"

export default function HomePage() {
  return (
    <LanguageProvider>
      <main>
        <Header />
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </main>
    </LanguageProvider>
  )
}
