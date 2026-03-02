'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCurrency } from '@/hooks/use-currency'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import {
    ShoppingCart,
    Heart,
    Star,
    CheckCircle2,
    Truck,
    Shield,
    Phone,
    ArrowLeft,
    Share2,
    Loader2,
    ArrowRight,
    Plus,
    X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddToCartModal } from '@/components/add-to-cart-modal'
import { toast } from 'sonner'

interface ProductDetailClientProps {
    product: any
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('features')
    const [isAdding, setIsAdding] = useState(false)
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)
    const { formatPrice } = useCurrency()
    const { user } = useAuth()
    const router = useRouter()

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Authentication Required', {
                description: 'Please sign in to manage your clinical workspace.'
            })
            router.push('/signin')
            return
        }

        setIsAdding(true)
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product._id, quantity })
            })
            const data = await res.json()

            if (data.success) {
                setIsModalOpen(true)
            } else {
                toast.error('Add to Cart Failed', {
                    description: data.error || 'Unable to add product to cart.'
                })
            }
        } catch (error) {
            toast.error('System Error', {
                description: 'A network error occurred.'
            })
        } finally {
            setIsAdding(false)
        }
    }

    const handleBuyNow = async () => {
        if (!user) {
            router.push('/signin')
            return
        }

        router.push(`/checkout?type=buy_now&productId=${product._id}&quantity=${quantity}`)
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <main className="flex-1 pt-24 lg:pt-32">
                {/* Breadcrumb */}
                <div className="border-b border-foreground/[0.05] bg-background">
                    <div className="container mx-auto max-w-7xl px-4 py-6">
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
                            <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowLeft className="h-3 w-3" />
                                Catalogue
                            </Link>
                            <span>/</span>
                            <span className="text-foreground">{product.category}</span>
                            <span>/</span>
                            <span className="truncate max-w-[200px] text-foreground/60">{product.name}</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-7xl px-4 py-12 lg:py-24">
                    <div className="grid gap-16 lg:grid-cols-2 items-start">
                        {/* Left: Product Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="relative rounded-none overflow-hidden bg-[#fbfbfb] aspect-square border border-foreground/[0.03] p-12 lg:p-20">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain mix-blend-multiply transition-transform duration-1000 hover:scale-105"
                                    priority
                                />
                                <AnimatePresence>
                                    {discount > 0 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-8 right-8 bg-black text-white px-4 py-2 font-black text-[10px] uppercase tracking-widest z-10"
                                        >
                                            -{discount}% OFF
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {product.badge && (
                                    <div className="absolute top-8 left-8 border border-foreground/10 px-4 py-2 font-black text-[10px] uppercase tracking-widest bg-white z-10 text-foreground">
                                        {product.badge}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Right: Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-10"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                                        {product.category}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="h-3 w-3 fill-foreground text-foreground" />
                                        <span className="text-[10px] font-bold tracking-widest text-foreground">{product.rating}</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-foreground">
                                    {product.name}
                                </h1>
                                <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-lg italic">
                                    "{product.description}"
                                </p>
                            </div>

                            {/* Pricing & Stock */}
                            <div className="p-8 border border-foreground/[0.05] bg-foreground/[0.01] space-y-4">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-xl text-muted-foreground line-through font-light">
                                            WAS {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                </div>

                                <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${product.stockCount > 0 ? 'text-primary' : 'text-red-500'}`}>
                                    {product.stockCount > 0 ? (
                                        <>
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            In Stock
                                        </>
                                    ) : (
                                        <>
                                            <X className="h-3.5 w-3.5" />
                                            Out of Stock
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex items-center border border-foreground/10 bg-white">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-6 py-4 hover:bg-foreground/5 transition-colors font-black text-foreground"
                                        >
                                            −
                                        </button>
                                        <span className="px-8 py-4 font-black text-sm border-l border-r border-foreground/10 min-w-16 text-center text-foreground">
                                            {quantity.toString().padStart(2, '0')}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-6 py-4 hover:bg-foreground/5 transition-colors font-black text-foreground"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <Button
                                        size="lg"
                                        disabled={product.stockCount <= 0 || isAdding}
                                        onClick={handleAddToCart}
                                        className={`flex-1 h-auto py-4 font-black uppercase tracking-widest text-xs rounded-none border transition-all duration-300 ${product.stockCount > 0 ? 'border-black bg-transparent text-black hover:bg-black hover:text-white' : 'bg-red-500/10 text-red-500 border-red-500/20 cursor-not-allowed'}`}
                                    >
                                        {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                            product.stockCount > 0 ? (
                                                <>
                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                    Add to Cart
                                                </>
                                            ) : 'Out of Stock'
                                        )}
                                    </Button>
                                </div>

                                <Button
                                    size="lg"
                                    disabled={product.stockCount <= 0 || isCheckingOut}
                                    onClick={handleBuyNow}
                                    className={`w-full h-auto py-5 font-black uppercase tracking-[0.3em] text-xs rounded-none transition-all duration-500 ${product.stockCount > 0 ? 'bg-black text-white hover:bg-primary' : 'bg-foreground/5 text-foreground/20 cursor-not-allowed'}`}
                                >
                                    {isCheckingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                        <>
                                            Buy Now
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex-1 h-auto py-4 font-black uppercase tracking-widest text-[9px] rounded-none border-foreground/10 hover:bg-foreground/5 transition-all text-muted-foreground"
                                    >
                                        Download Tech Specs (PDF)
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setIsFavorited(!isFavorited)}
                                        className="px-6 h-auto py-4 rounded-none border-foreground/10 hover:bg-foreground/5 transition-all"
                                    >
                                        <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                                    </Button>
                                </div>
                            </div>

                            {/* Service Logistics */}
                            <div className="grid grid-cols-2 gap-4 py-8 border-y border-foreground/[0.05]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full border border-foreground/5 flex items-center justify-center">
                                        <Truck className="h-4 w-4 opacity-40 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase leading-tight text-foreground">Global Shipping</p>
                                        <p className="text-[9px] font-medium opacity-40 uppercase text-foreground/50">Express delivery</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full border border-foreground/5 flex items-center justify-center">
                                        <Shield className="h-4 w-4 opacity-40 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase leading-tight text-foreground">5 Year Warranty</p>
                                        <p className="text-[9px] font-medium opacity-40 uppercase text-foreground/50">Clinical Protection</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-32 border-t border-foreground/[0.05] pt-16">
                        <div className="flex gap-12 border-b border-foreground/[0.05] mb-12 overflow-x-auto no-scrollbar">
                            {['features', 'specifications', 'support'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab
                                        ? 'text-foreground'
                                        : 'text-foreground/30 hover:text-foreground/60'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-foreground" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                className="max-w-4xl"
                            >
                                {activeTab === 'features' && (
                                    <div className="grid gap-12 md:grid-cols-2">
                                        {product.features?.map((feature: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-4 group">
                                                <div className="h-px w-8 bg-primary/30 mt-3 group-hover:w-12 transition-all duration-500" />
                                                <span className="text-lg font-light text-foreground/80 leading-relaxed italic">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'specifications' && (
                                    <div className="space-y-4 text-foreground">
                                        <div className="p-8 border border-foreground/[0.03] bg-foreground/[0.01]">
                                            <p className="text-sm font-light leading-relaxed text-muted-foreground mb-6">
                                                Technical architecture and clinical parameters for the {product.name}.
                                            </p>
                                            <div className="grid gap-4">
                                                {product.specifications && Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                                                    <div key={key} className="flex justify-between py-3 border-b border-foreground/[0.03] text-[10px] font-black uppercase tracking-widest">
                                                        <span className="opacity-40">{key}</span>
                                                        <span>{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'support' && (
                                    <div className="grid gap-12 md:grid-cols-2 text-foreground">
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter">Customer Support</h3>
                                            <p className="text-muted-foreground font-light leading-relaxed">
                                                Our specialized engineers are available 24/7 to provide technical support for all your equipment needs.
                                            </p>
                                            <div className="flex items-center gap-4 p-6 border border-foreground/[0.05] bg-foreground/[0.01]">
                                                <Phone className="h-5 w-5 opacity-40" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">+1 (800) SATYA-VIJ</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <AddToCartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
                quantity={quantity}
            />
        </div>
    )
}
