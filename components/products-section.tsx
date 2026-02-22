'use client'

import { ProductCard } from './product-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ProductsSection() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=6')
        const data = await response.json()
        if (data.success) {
          setProducts(data.data)
        } else {
          setError(data.error || 'Failed to fetch products')
        }
      } catch (err) {
        setError('Connection to server failed')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[100px] -z-10" />

      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center space-y-4"
        >
          <h2 className="text-4xl font-black md:text-5xl lg:text-6xl text-balance text-foreground uppercase tracking-tight">
            Curated <span className="text-stroke">Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Discover our comprehensive range of medical devices designed for accuracy, reliability, and ease of use in professional environments.
          </p>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-dashed border-foreground/10">
            <p className="text-muted-foreground font-medium mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry Connection</Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product: any, index: number) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link href="/products">
            <Button size="lg" variant="outline" className="h-14 px-10 text-base font-bold rounded-none border-foreground/10 hover:bg-foreground/5 hover:translate-y-[-4px] transition-transform duration-300">
              EXPLORE FULL CATALOGUE
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

