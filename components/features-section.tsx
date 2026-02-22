'use client'

import { CheckCircle2, Shield, Truck, Headphones, Award, Zap, TrendingUp, Lock } from 'lucide-react'

const features = [
  {
    icon: CheckCircle2,
    title: 'FDA & CE Certified',
    description: 'All products meet FDA approval, CE marking, and ISO 13485 medical device standards with comprehensive compliance documentation',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Rigorous testing, third-party validation, and stringent quality control protocols ensure reliability in critical care environments',
  },
  {
    icon: Truck,
    title: 'Express Delivery',
    description: 'Free shipping with 1-3 business day delivery to hospitals, clinics, and healthcare facilities nationwide',
  },
  {
    icon: Headphones,
    title: '24/7 Expert Support',
    description: 'Dedicated medical equipment specialists available round-the-clock for technical support and product guidance',
  },
  {
    icon: Award,
    title: 'Certified Specialists',
    description: 'Team of certified biomedical engineers and healthcare professionals with 15+ years of industry experience',
  },
  {
    icon: Zap,
    title: 'Extended Warranty',
    description: 'Comprehensive 3-5 year warranties, free maintenance, and lifetime technical support on select products',
  },
  {
    icon: TrendingUp,
    title: 'Trusted by 1000+',
    description: 'Serving leading hospitals, diagnostic centers, and healthcare institutions across the country since 2008',
  },
  {
    icon: Lock,
    title: 'HIPAA Compliant',
    description: 'All digital solutions meet HIPAA requirements with encrypted data transmission and secure patient information handling',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background via-card/20 to-background">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Why Choose Satyavij
          </span>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl text-balance text-foreground">
            Trusted by Healthcare Leaders Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We deliver premium medical equipment with world-class support, compliance, and customer satisfaction that healthcare institutions depend on.
          </p>
        </div>

        {/* Features Grid - 4 columns */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-7 hover:border-primary/60 hover:bg-card/80 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                {/* Icon Container */}
                <div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 p-3.5 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                  {feature.description}
                </p>

                {/* Accent line on hover */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-transparent group-hover:w-full transition-all duration-300" />
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid gap-8 md:grid-cols-4 pt-16 border-t border-border/50">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <p className="text-muted-foreground">Years of Industry Excellence</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <p className="text-muted-foreground">Healthcare Institutions Served</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Premium Medical Products</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
            <p className="text-muted-foreground">Customer Satisfaction Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
