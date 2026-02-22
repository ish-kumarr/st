'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Plus, Star, Loader2, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useCurrency } from '@/hooks/use-currency'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { AddToCartModal } from './add-to-cart-modal'

interface ProductCardProps {
  _id: string
  slug: string
  name: string
  category: string
  description: string
  image: string
  price: number
  originalPrice?: number
  inStock: boolean
  stockCount: number
  rating?: number
  reviews?: number
  badge?: string
  features?: string[]
}

export function ProductCard({
  _id,
  slug,
  name,
  category,
  image,
  price,
  originalPrice,
  inStock,
  stockCount,
  rating = 4.8,
  badge,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { formatPrice } = useCurrency()
  const { user } = useAuth()
  const router = useRouter()

  const effectivelyInStock = inStock && stockCount > 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      router.push('/signin')
      return
    }

    if (!effectivelyInStock) return

    setIsAdding(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: _id,
          quantity: 1
        })
      })

      if (res.ok) {
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error('Cart synchronization failed:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col bg-white overflow-hidden transition-all duration-700"
      >
        <Link href={`/products/${slug}`} className="block relative">
          {/* Visual Container */}
          <div className="relative aspect-[1/1.1] overflow-hidden bg-[#fbfbfb] border border-foreground/[0.03]">
            {/* Subtle Label */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40 leading-none">
                {category}
              </span>
              {badge && (
                <span className="inline-block px-2 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest w-fit">
                  {badge}
                </span>
              )}
            </div>

            {/* Main Image */}
            <motion.div
              animate={{
                scale: isHovered ? 1.04 : 1,
                y: isHovered ? -10 : 0
              }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full relative"
            >
              <Image
                src={image}
                alt={name}
                fill
                className={`object-contain p-12 mix-blend-multiply transition-all duration-1000 ${isHovered ? 'opacity-100 scale-105' : 'opacity-80'} ${!effectivelyInStock ? 'grayscale opacity-40' : ''}`}
                priority
              />
            </motion.div>

            {/* Out of Stock Overlay */}
            {!effectivelyInStock && (
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
                <div className="bg-white border-2 border-red-500/20 px-6 py-3 shadow-2xl">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Out of Stock</span>
                </div>
              </div>
            )}

            {/* Minimalist Price Tag */}
            <div className="absolute bottom-6 left-6 z-20">
              <p className={`text-2xl font-black tracking-tighter text-foreground leading-none ${!effectivelyInStock ? 'opacity-30' : ''}`}>
                {formatPrice(price)}
              </p>
            </div>

            {/* Subtle Arrow Reveal */}
            <div className="absolute bottom-6 right-6 z-20 overflow-hidden">
              <motion.div
                animate={{ y: isHovered ? 0 : 40, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Info Container */}
          <div className="pt-8 pb-4 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <h3 className={`text-lg font-black uppercase tracking-tighter leading-[1.1] text-foreground group-hover:text-primary transition-colors duration-500 max-w-[80%] ${!effectivelyInStock ? 'opacity-50' : ''}`}>
                {name}
              </h3>
              <div className="flex items-center gap-1.5 pt-1">
                <Star className="h-3 w-3 fill-foreground text-foreground" />
                <span className="text-[10px] font-bold tracking-widest">{rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-foreground/[0.05] pt-4">
              <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${effectivelyInStock ? 'text-primary' : 'text-red-500'}`}>
                {effectivelyInStock ? '✓ In Stock' : '× Deployment Restricted'}
              </div>
              {originalPrice && (
                <span className="text-[10px] font-medium text-foreground/30 line-through">
                  WAS {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Action Button */}
        <motion.button
          animate={{
            y: isHovered ? 0 : 20,
            opacity: isHovered ? 1 : 0
          }}
          disabled={!effectivelyInStock || isAdding}
          onClick={handleAddToCart}
          className={`w-full h-12 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-colors duration-300 ${effectivelyInStock ? 'bg-black text-white hover:bg-primary' : 'bg-red-500/10 text-red-500 cursor-not-allowed border-t border-red-500/20'}`}
        >
          {isAdding ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : effectivelyInStock ? (
            <>
              <Plus className="h-3 w-3" /> Add to Cart
            </>
          ) : (
            'Out of Stock'
          )}
        </motion.button>
      </motion.div>

      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ name, price, image }}
        quantity={1}
      />
    </>
  )
}

