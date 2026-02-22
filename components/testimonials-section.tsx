'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Dr. Rajesh Kumar',
    title: 'Chief Cardiologist',
    hospital: 'Apollo Hospitals, Mumbai',
    content:
      'Satyavij has been our trusted partner for 8 years. Their digital stethoscopes and patient monitors have significantly improved our diagnostic capabilities. The after-sales support is exceptional.',
    rating: 5,
    image: '👨‍⚕️',
  },
  {
    name: 'Dr. Priya Sharma',
    title: 'Director of Diagnostics',
    hospital: 'Max Healthcare, Delhi',
    content:
      'We manage 50+ hospitals across India, and Satyavij equipment performs consistently across all facilities. Their commitment to quality and compliance is unmatched in the industry.',
    rating: 5,
    image: '👩‍⚕️',
  },
  {
    name: 'Mr. Vikram Singh',
    title: 'Hospital Administrator',
    hospital: 'Ruby Hall Clinic, Pune',
    content:
      'Outstanding service from day one. Their team helped us set up an entire ICU with the right equipment mix. ROI has been excellent, and our patient satisfaction scores improved by 35%.',
    rating: 5,
    image: '👨‍💼',
  },
  {
    name: 'Dr. Anjali Verma',
    title: 'General Practitioner',
    hospital: 'Delhi Medical Center',
    content:
      'As a small clinic, we needed affordable yet reliable equipment. Satyavij delivered exactly that. Their budget-friendly product line is perfect for emerging healthcare providers.',
    rating: 5,
    image: '👩‍⚕️',
  },
  {
    name: 'Mr. Arjun Patel',
    title: 'Procurement Manager',
    hospital: 'Fortis Healthcare',
    content:
      'Best vendor experience we have had. Transparent pricing, on-time delivery, and comprehensive training for our staff. They truly understand healthcare facility needs.',
    rating: 5,
    image: '👨‍💼',
  },
  {
    name: 'Dr. Neha Gupta',
    title: 'Emergency Medicine Specialist',
    hospital: 'AIIMS, New Delhi',
    content:
      'Our Automated External Defibrillator from Satyavij has saved lives. The reliability and ease of use in emergency situations is critical, and they deliver on both counts.',
    rating: 5,
    image: '👩‍⚕️',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl text-balance text-foreground">
            Trusted by Healthcare Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hear from hospitals, clinics, and healthcare professionals who have transformed their operations with Satyavij
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm hover:border-primary/60 hover:bg-card/80 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 flex-1 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="pt-6 border-t border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {testimonial.hospital}
                </p>
              </div>

              {/* Accent line on hover */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-transparent group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid gap-8 md:grid-cols-4 pt-16 border-t border-border/50">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">1000+</div>
            <p className="text-muted-foreground font-medium">Healthcare Facilities</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">10000+</div>
            <p className="text-muted-foreground font-medium">Lives Improved</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">4.9/5</div>
            <p className="text-muted-foreground font-medium">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">99.8%</div>
            <p className="text-muted-foreground font-medium">Uptime Guarantee</p>
          </div>
        </div>
      </div>
    </section>
  )
}
