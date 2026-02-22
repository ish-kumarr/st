'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowLeft, ShieldCheck, MapPin, CreditCard, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useCurrency } from '@/hooks/use-currency'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'

import { Suspense } from 'react'

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
                <Loader2 className="w-8 h-8 animate-spin text-foreground/40" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}

function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const { formatPrice, currency } = useCurrency()

    const isBuyNow = searchParams.get('type') === 'buy_now'
    const productId = searchParams.get('productId')
    const quantity = Number(searchParams.get('quantity')) || 1
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // items to check out
    const [items, setItems] = useState<any[]>([])
    const [total, setTotal] = useState(0)

    // Form states
    const [addresses, setAddresses] = useState<any[]>([])
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)

    const [form, setForm] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: '',
        saveAddress: false
    })

    const [paymentMethod, setPaymentMethod] = useState('razorpay')

    useEffect(() => {
        if (!user) {
            router.push('/signin')
            return
        }

        const fetchCheckoutData = async () => {
            try {
                // Fetch User Details for saved addresses
                const userRes = await fetch('/api/auth/me')
                if (userRes.ok) {
                    const userData = await userRes.json()
                    const userAddresses = userData.user?.savedAddresses || []
                    setAddresses(userAddresses)
                    if (userAddresses.length > 0) {
                        setSelectedAddressIndex(0)
                        setForm({ ...userAddresses[0], saveAddress: false }) // prepopulate form
                    } else {
                        setIsAddingNewAddress(true)
                    }
                }

                if (isBuyNow && productId) {
                    const prodRes = await fetch(`/api/products?id=${productId}`)
                    const prodData = await prodRes.json()

                    if (prodData.success && prodData.data.length > 0) {
                        setItems([{ product: prodData.data[0], quantity }])
                        setTotal(prodData.data[0].price * quantity)
                    } else {
                        // try slug match fallback if somehow passed
                        const slugRes = await fetch(`/api/products/${productId}`)
                        const slugData = await slugRes.json()
                        if (slugData.success) {
                            setItems([{ product: slugData.data, quantity }])
                            setTotal(slugData.data.price * quantity)
                        }
                    }
                } else {
                    const cartRes = await fetch('/api/cart')
                    const cartData = await cartRes.json()
                    if (cartData.success) {
                        if (cartData.cart.length === 0) {
                            toast.error('Cart is empty')
                            router.push('/cart')
                            return
                        }
                        setItems(cartData.cart)
                        const t = cartData.cart.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0)
                        setTotal(t)
                    }
                }
            } catch (error) {
                toast.error('Failed to load checkout data')
            } finally {
                setLoading(false)
            }
        }

        fetchCheckoutData()
    }, [user, router, isBuyNow, productId, quantity])

    const handleAddressSelect = (index: number) => {
        setSelectedAddressIndex(index)
        setIsAddingNewAddress(false)
        const addr = addresses[index]
        setForm({
            fullName: addr.fullName,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 || '',
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
            phone: addr.phone,
            saveAddress: false
        })
    }

    const handleNewAddress = () => {
        setSelectedAddressIndex(null)
        setIsAddingNewAddress(true)
        setForm({
            fullName: '', addressLine1: '', addressLine2: '',
            city: '', state: '', postalCode: '', country: '', phone: '', saveAddress: true
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (items.length === 0) return

        setSubmitting(true)

        try {
            const payload = {
                type: isBuyNow ? 'buy_now' : 'cart_checkout',
                productId: isBuyNow ? productId : undefined,
                quantity: isBuyNow ? quantity : undefined,
                shippingAddress: {
                    fullName: form.fullName,
                    addressLine1: form.addressLine1,
                    addressLine2: form.addressLine2,
                    city: form.city,
                    state: form.state,
                    postalCode: form.postalCode,
                    country: form.country,
                    phone: form.phone
                },
                paymentMethod,
                saveAddress: form.saveAddress,
                currency
            }

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (data.success) {
                if (paymentMethod === 'cod') {
                    toast.success('Order Placed on COD!')
                    router.push('/cart?success=true')
                    return;
                }

                const options = {
                    key: data.key,
                    amount: data.amount,
                    currency: data.currency || currency,
                    name: "Satyavij Healthcare",
                    description: "Clinical Equipment Purchase",
                    order_id: data.razorpayOrderId,
                    handler: async function (response: any) {
                        // Verify Payment
                        try {
                            const verifyRes = await fetch('/api/checkout/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            })

                            const verifyData = await verifyRes.json()
                            if (verifyData.success) {
                                toast.success('Payment Successful!')
                                router.push('/cart?success=true')
                            } else {
                                toast.error('Payment Verification Failed', { description: 'Please contact support.' })
                            }
                        } catch (e) {
                            toast.error('Verification Error')
                        }
                    },
                    prefill: {
                        name: form.fullName,
                        email: user?.email || '',
                        contact: form.phone
                    },
                    theme: {
                        color: "#000000" // Black brand theme
                    }
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();

                // On closed before paying
                paymentObject.on('payment.failed', function (response: any) {
                    toast.error('Payment failed / interrupted', { description: response.error.description })
                    setSubmitting(false)
                });

            } else {
                toast.error(data.error || 'Checkout failed')
                setSubmitting(false)
            }
        } catch (error) {
            toast.error('A network error occurred during checkout.')
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
                <Loader2 className="w-8 h-8 animate-spin text-foreground/40" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fbfbfb] pt-32 pb-24">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Header */}
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <Link href={isBuyNow ? `/products/${productId}` : "/cart"} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors mb-4">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </Link>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Secure Checkout</h1>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-12">

                        {/* Address Selection Section */}
                        <section className="bg-white p-8 border border-foreground/5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black">1</div>
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Shipping Address
                                </h2>
                            </div>

                            {addresses.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    {addresses.map((addr, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleAddressSelect(idx)}
                                            className={`p-4 border cursor-pointer transition-all ${selectedAddressIndex === idx ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-foreground/10 hover:border-foreground/30'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xs font-bold uppercase tracking-wider">{addr.fullName}</h3>
                                                {selectedAddressIndex === idx && <CheckCircle className="w-4 h-4 text-primary" />}
                                            </div>
                                            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                                                {addr.addressLine1} {addr.addressLine2}<br />
                                                {addr.city}, {addr.state} {addr.postalCode}<br />
                                                {addr.country}<br />
                                                {addr.phone}
                                            </p>
                                        </div>
                                    ))}
                                    <div
                                        onClick={handleNewAddress}
                                        className={`p-4 border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isAddingNewAddress ? 'border-primary bg-primary/5' : 'border-foreground/20 hover:border-foreground/40 hover:bg-black/5'}`}
                                    >
                                        <span className="text-xs font-black uppercase tracking-widest text-foreground/60">+ Add New Address</span>
                                    </div>
                                </div>
                            )}

                            <AnimatePresence>
                                {isAddingNewAddress && (
                                    <motion.form
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        id="checkout-form"
                                        onSubmit={handleSubmit}
                                        className="space-y-6 pt-6 border-t border-foreground/5 overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Full Name</label>
                                                <input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-white/50" placeholder="Dr. Jane Doe" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Phone Number</label>
                                                <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-white/50" placeholder="+1 555-0198" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Street Address</label>
                                            <input required value={form.addressLine1} onChange={e => setForm({ ...form, addressLine1: e.target.value })} className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-white/50" placeholder="123 Clinical Blvd" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Apartment / Suite (Optional)</label>
                                            <input value={form.addressLine2} onChange={e => setForm({ ...form, addressLine2: e.target.value })} className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-white/50" placeholder="Suite 4B" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">City</label>
                                                <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-white/50" placeholder="Metropolis" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">State / Region</label>
                                                <input required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-white/50" placeholder="NY" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Postal Code</label>
                                                <input required value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-white/50" placeholder="10001" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Country</label>
                                                <input required value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full px-5 py-4 border border-foreground/10 focus:border-black focus:outline-none text-xs font-bold transition-colors bg-white/50" placeholder="USA" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4">
                                            <input
                                                type="checkbox"
                                                id="saveAddress"
                                                checked={form.saveAddress}
                                                onChange={e => setForm({ ...form, saveAddress: e.target.checked })}
                                                className="w-4 h-4 accent-black"
                                            />
                                            <label htmlFor="saveAddress" className="text-xs font-bold tracking-widest uppercase cursor-pointer">
                                                Save this address to my profile
                                            </label>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Payment Selection Section */}
                        <section className="bg-white p-8 border border-foreground/5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-black/10 transition-colors group-hover:bg-black/20"></div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-black/10 flex items-center justify-center text-xs font-black">2</div>
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Payment Method
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'razorpay', label: 'Razorpay Gateway', desc: 'Secure payment via Cards, UPI, or Netbanking' },
                                    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your equipment arrives' }
                                ].map(method => (
                                    <label key={method.id} className={`flex items-start gap-4 p-5 border cursor-pointer transition-all ${paymentMethod === method.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-foreground/10 hover:border-foreground/30'}`}>
                                        <div className="pt-0.5">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={() => setPaymentMethod(method.id)}
                                                className="w-4 h-4 accent-primary"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">{method.label}</h3>
                                            <p className="text-[10px] text-foreground/50 tracking-widest uppercase font-medium">{method.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 bg-white p-8 border border-foreground/5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-8 pb-4 border-b border-foreground/5">Order Summary</h2>

                            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="relative w-20 h-20 bg-[#fbfbfb] flex-shrink-0 border border-foreground/5 p-2">
                                            <Image
                                                src={item.product?.image || '/placeholder.png'}
                                                alt={item.product?.name || 'Product'}
                                                fill
                                                className="object-contain p-2 mix-blend-multiply transition-transform group-hover:scale-110 duration-500"
                                            />
                                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[9px] font-black z-10 shadow-lg">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1 line-clamp-1">{item.product?.category}</p>
                                                <h4 className="text-xs font-black uppercase tracking-wider truncate leading-tight group-hover:text-primary transition-colors">{item.product?.name}</h4>
                                            </div>
                                            <p className="text-sm font-black tracking-tighter">{formatPrice(item.product?.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-foreground/5">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-foreground/50">Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-foreground/50">Shipping</span>
                                    <span className="text-emerald-500">Free</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-foreground/50">Taxes (Estimated)</span>
                                    <span>{formatPrice(total * 0.05)}</span>
                                </div>

                                <div className="pt-4 border-t border-foreground/5 flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-[0.2em]">Total</span>
                                    <div className="text-right">
                                        <div className="text-3xl font-black tracking-tighter leading-none">{formatPrice(total + (total * 0.05))}</div>
                                        <span className="text-[9px] font-medium text-foreground/40 uppercase tracking-widest">Including VAT</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={isAddingNewAddress ? undefined : handleSubmit}
                                type={isAddingNewAddress ? "submit" : "button"}
                                form={isAddingNewAddress ? "checkout-form" : undefined}
                                disabled={submitting}
                                className="w-full mt-8 bg-black text-white h-16 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.3em] hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {submitting ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <>Complete Order <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
                                    )}
                                </span>
                            </button>
                            <p className="text-center text-[9px] uppercase tracking-widest font-bold text-foreground/30 mt-4 flex items-center justify-center gap-2">
                                <ShieldCheck className="w-3 h-3" /> Secure Payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CheckCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
