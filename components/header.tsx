'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '@/hooks/use-currency'
import { useAuth } from '@/hooks/use-auth'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { currency, setCurrency } = useCurrency()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/40 py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-10 w-10 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <Image
                src="/images/Logo.png"
                alt="Satyavij Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black uppercase tracking-tighter text-foreground leading-none">
                Satya<span className="text-stroke">Vij</span>
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                Healthcare Pvt. Ltd.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden gap-10 md:flex items-center">
            {['Products', 'Solutions', 'About', 'Contact'].map((item) => (
              <Link key={item} href={item === 'Products' ? '/products' : '#'} className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link href="/admin" className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:text-foreground group">
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Currency Selector */}
            <div className="flex items-center gap-2 border border-foreground/10 px-2 py-1">
              <span className="text-[9px] font-black opacity-40 uppercase">CCY</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
                <option value="JPY">JPY</option>
              </select>
            </div>

            <Link href="/cart" className="relative text-foreground hover:opacity-70 transition-opacity">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 h-4 w-4 bg-primary text-[10px] font-bold flex items-center justify-center rounded-full text-white">
                {user ? '0' : '0'}
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary">Authorized</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter">{user.name || 'User'}</span>
                </div>
                <Link href="/orders">
                  <Button variant="outline" size="sm" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest rounded-none border border-foreground/10 hover:bg-black hover:text-white transition-all">
                    My Orders
                  </Button>
                </Link>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                  className="h-10 px-4 text-[10px] font-black uppercase tracking-widest rounded-none border border-foreground/10 hover:bg-primary hover:text-white transition-all"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/signin">
                <Button size="sm" className="h-10 px-6 text-xs font-bold rounded-none bg-foreground text-background hover:bg-foreground/90 transition-transform duration-300 hover:translate-y-[-2px]">
                  SIGN IN
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-background border-b border-border p-8 flex flex-col gap-6 md:hidden shadow-2xl"
            >
              {['Products', 'Solutions', 'About', 'Contact'].map((item) => (
                <Link key={item} href={item === 'Products' ? '/products' : '#'} className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
              <div className="flex flex-col gap-4 mt-4">
                <Link href="/cart">
                  <Button variant="outline" className="w-full h-14 font-bold rounded-none">
                    CART ({user ? '0' : '0'})
                  </Button>
                </Link>
                {user ? (
                  <>
                    <Link href="/orders">
                      <Button variant="outline" className="w-full h-14 font-bold rounded-none bg-white text-black border-foreground/10">
                        MY ORDERS
                      </Button>
                    </Link>
                    <Button onClick={signOut} className="w-full h-14 font-bold rounded-none bg-red-50 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white">
                      SIGN OUT
                    </Button>
                  </>
                ) : (
                  <Link href="/signin">
                    <Button className="w-full h-14 font-bold rounded-none bg-foreground text-background">
                      SIGN IN
                    </Button>
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

