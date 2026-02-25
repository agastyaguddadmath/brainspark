import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/landing/hero-section"
import { CategoriesSection } from "@/components/landing/categories-section"
import { AgeGroupsSection } from "@/components/landing/age-groups-section"
import { FeaturesSection } from "@/components/landing/features-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <AgeGroupsSection />
        <FeaturesSection />
      </main>
      <SiteFooter />
    </div>
  )
}
