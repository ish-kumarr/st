'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-8 md:p-12 lg:p-16 text-white">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
                Ready to Upgrade Your Healthcare Facility?
              </h2>
              <p className="text-lg text-white/90">
                Get in touch with our team to discuss your medical equipment needs. We offer personalized solutions for hospitals, clinics, and healthcare institutions.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2 group"
                >
                  Request a Quote
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg bg-white/10 backdrop-blur p-6 space-y-2">
                <h3 className="text-lg font-semibold">Quick Contact</h3>
                <p className="text-white/80 text-sm">satyavij.care@gmail.com</p>
              </div>
              <div className="rounded-lg bg-white/10 backdrop-blur p-6 space-y-2">
                <h3 className="text-lg font-semibold">Business Hours</h3>
                <p className="text-white/80 text-sm">Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p className="text-white/80 text-sm">Sat: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
