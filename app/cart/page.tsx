'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Plus, Minus, ShoppingCart, Truck, Lock, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/hooks/use-auth'
import { useCurrency } from '@/hooks/use-currency'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'

function CartContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoading: isAuthLoading } = useAuth()
  const { formatPrice } = useCurrency()
  const router = useRouter()

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      const data = await res.json()
      if (data.success) {
        setCartItems(data.cart)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to load cart')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push('/signup')
      } else {
        fetchCart()
      }
    }
  }, [user, isAuthLoading])

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity - (cartItems.find(i => i.product._id === productId)?.quantity || 0) })
      })
      if (res.ok) {
        fetchCart()
      }
    } catch (err) {
      console.error('Update failed')
    }
  }

  const removeItem = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      if (res.ok) {
        fetchCart()
      }
    } catch (err) {
      console.error('Remove failed')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const tax = Math.round(subtotal * 0.1 * 100) / 100
  const shipping = subtotal > 500 ? 0 : 25
  const total = subtotal + tax + shipping

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto max-w-7xl px-4 py-20 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex justify-center">
              <div className="p-4 bg-muted rounded-full">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Your cart is empty</h1>
              <p className="text-muted-foreground">
                Start shopping to add items to your cart
              </p>
            </div>
            <Link href="/products">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingCart className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {success && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-emerald-500 text-white p-4 text-center text-[10px] font-black uppercase tracking-widest"
        >
          Deployment Successful. Your professional equipment order has been confirmed.
        </motion.div>
      )}
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Back to Catalogue
          </Link>
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-2">Workspace <br />Items</h1>
          <p className="text-muted-foreground font-light text-lg">Review and finalize your clinical selection</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any) => (
                <Card key={item.product._id} className="border-border/50 overflow-hidden shadow-none rounded-none">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row gap-4 p-8">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 flex-shrink-0 bg-[#fbfbfb] border border-foreground/[0.05] p-4">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 space-y-2 py-2">
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                            {item.product.category}
                          </p>
                          <h3 className="text-xl font-black uppercase tracking-tighter text-foreground">
                            {item.product.name}
                          </h3>
                        </div>
                        <p className="text-2xl font-black text-foreground">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex flex-col items-end justify-between py-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-foreground/10 bg-white">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="px-4 py-2 hover:bg-foreground/5 transition-colors font-black"
                          >
                            −
                          </button>
                          <span className="px-6 py-2 font-black text-xs border-l border-r border-foreground/10 min-w-12 text-center">
                            {item.quantity.toString().padStart(2, '0')}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="px-4 py-2 hover:bg-foreground/5 transition-colors font-black"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove Item
                        </button>

                        {/* Item Total */}
                        <div className="text-right mt-4 pt-4 border-t border-foreground/[0.05] w-full">
                          <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Selection total</p>
                          <p className="text-lg font-black text-foreground">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4 h-fit sticky top-28">
              {/* Summary Card */}
              <Card className="border-border/50 shadow-none rounded-none border-2 border-black">
                <CardHeader className="bg-black text-white p-6">
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-8 pb-8 px-6">
                  {/* Items Count */}
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="opacity-40">Items Selection ({cartItems.length})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="opacity-40">Clinical Tax (10%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest pb-6 border-b border-foreground/[0.05]">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 opacity-40" />
                      <span className="opacity-40">
                        Logistics {subtotal > 500 && '(FREE)'}
                      </span>
                    </div>
                    <span>{formatPrice(shipping)}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Total Amount</span>
                    <span className="text-3xl font-black text-foreground tracking-tighter">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full h-16 rounded-none bg-black text-white hover:bg-primary border-none font-black uppercase tracking-[0.3em] text-[10px] gap-3"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <>
                        <Lock className="h-4 w-4" />
                        Authorize Checkout
                      </>
                    )}
                  </Button>
                  <Link href="/products">
                    <Button variant="outline" className="w-full border-foreground/10 rounded-none h-14 font-black uppercase tracking-widest text-[9px] text-muted-foreground hover:bg-foreground/5 transition-all">
                      Continue Browsing
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Info Cards */}
              <div className="flex gap-4 p-6 border border-foreground/[0.05] bg-foreground/[0.01]">
                <Lock className="h-5 w-5 opacity-40" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest">Secure Deployment</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Encrypted clinical transaction</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CartContent />
    </Suspense>
  )
}
