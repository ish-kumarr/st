'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Filter, Search, X, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/products')
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

  // Get unique categories from dynamic products
  const categories = ['All', ...new Set(products.map((p) => p.category))]

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section - Harmonized with Landing Page */}
        <div className="bg-background border-b border-foreground/[0.05] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] -z-10" />
          <div className="container mx-auto max-w-7xl px-4 py-24 lg:py-40">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Explore Products</span>
                <h1 className="text-6xl font-black md:text-8xl lg:text-9xl text-foreground uppercase tracking-tight leading-none">
                  Full <span className="text-stroke">Catalogue</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed uppercase tracking-wide">
                Advanced medical solutions designed for professional accuracy and clinical reliability.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-20">
          {/* Search & Filter Bar - Minimalist */}
          <div className="mb-16 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-none border border-foreground/10 bg-white focus:outline-none focus:border-primary text-[10px] font-black uppercase tracking-widest transition-all"
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-white border border-foreground/10 text-foreground/40 hover:border-black hover:text-black'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[1/1.1] bg-foreground/5 animate-pulse" />
              ))
            ) : error ? (
              <div className="col-span-full text-center py-20 border border-dashed border-foreground/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-6">{error}</p>
                <Button variant="outline" className="rounded-none font-black uppercase tracking-widest text-[9px]" onClick={() => window.location.reload()}>Retry Connection</Button>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product._id} {...product} />
              ))
            ) : (
              <div className="col-span-full py-40 text-center space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No products found</p>
                <Button
                  variant="outline"
                  className="rounded-none font-black uppercase tracking-widest text-[9px]"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                  }}
                >
                  Reset Parameters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
