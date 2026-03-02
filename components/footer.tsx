'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group inline-block transition-transform duration-500 hover:scale-105">
              <div className="relative h-10 w-10">
                <Image
                  src="/images/Logo.png"
                  alt="Satyavij Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter text-foreground">
                Satya<span className="text-stroke">Vij</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Satyavij Healthcare Pvt. Ltd. - Trusted supplier of premium medical equipment and healthcare solutions for institutions worldwide.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Diagnostic Equipment
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Monitoring Devices
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Surgical Equipment
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Emergency Equipment
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 text-muted-foreground">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                <span>+91 98178 82309</span>
              </li>
              <li className="flex gap-2 text-muted-foreground">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                <span>info@satyavij.com</span>
              </li>
              <li className="flex gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                <span>Gali No-1, Devi Lal Colony, Mehalana Road, Sonipat, Haryana – 131001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Satyavij Medical Equipment. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
