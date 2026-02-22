import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { ProductsSection } from '@/components/products-section'
import { FeaturesSection } from '@/components/features-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col">
        <HeroSection />
        <ProductsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
