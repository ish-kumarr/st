'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, MapPin, CreditCard, ChevronDown, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/user/orders')
                const data = await res.json()
                if (data.success) {
                    setOrders(data.orders)
                } else {
                    toast.error(data.error || 'Failed to fetch orders')
                }
            } catch (error) {
                toast.error('Could not connect to the server.')
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    return (
        <div className="min-h-screen bg-[#fbfbfb] text-foreground selection:bg-black selection:text-white flex flex-col">
            <Header />
            <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-8 pt-32 lg:pt-40 pb-20" style={{ minHeight: 'calc(100vh - 100px)' }}>
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">My Orders</h1>
                    <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] text-foreground/40">View and track your purchases</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center border dashed border-foreground/10">
                        <Package className="h-12 w-12 mx-auto text-foreground/20 mb-4" />
                        <h2 className="text-xl font-black uppercase tracking-tight mb-2">No Orders Found</h2>
                        <p className="text-sm text-foreground/60 mb-6">Looks like you haven't placed any orders yet.</p>
                        <Button onClick={() => window.location.href = '/'} className="h-12 px-8 rounded-none font-black uppercase tracking-widest text-[10px]">Start Shopping</Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                layout
                                className="bg-white border border-foreground/10 hover:shadow-2xl transition-all"
                            >
                                {/* Order Header - Always Visible */}
                                <div
                                    className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                >
                                    <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-16">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-1">Order ID</p>
                                            <p className="text-[11px] font-black uppercase tracking-widest">#{order._id.slice(-10)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-1">Date</p>
                                            <p className="text-[11px] font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-1">Total</p>
                                            <p className="text-[12px] font-black">₹{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-1">Status</p>
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${order.status === 'delivered' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-50/50' :
                                                order.status === 'shipped' ? 'border-blue-500/20 text-blue-500 bg-blue-50/50' :
                                                    order.status === 'cancelled' ? 'border-red-500/20 text-red-500 bg-red-50/50' :
                                                        'border-amber-500/20 text-amber-500 bg-amber-50/50'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-foreground/10">
                                        {/* Download Invoice Button */}
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(order.invoiceUrl || `/api/user/orders/${order._id}/invoice`, '_blank');
                                            }}
                                            className="h-10 px-4 rounded-none border border-black bg-black text-white hover:bg-white hover:text-black font-black uppercase tracking-widest text-[9px] gap-2 transition-colors"
                                        >
                                            <Download className="h-3 w-3" />
                                            Invoice
                                        </Button>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group">
                                            {expandedOrder === order._id ? 'Close Details' : 'View Details'}
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details - Expandable */}
                                <AnimatePresence>
                                    {expandedOrder === order._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-[#fafafa] border-t border-foreground/5"
                                        >
                                            <div className="p-6 md:p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                                                {/* Items */}
                                                <div className="lg:col-span-2 space-y-6">
                                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                        <Package className="h-4 w-4" /> Order Items
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {order.items.map((item: any, idx: number) => (
                                                            <div key={idx} className="flex gap-4 p-4 bg-white border border-foreground/5">
                                                                <div className="w-20 h-20 bg-[#fbfbfb] border border-foreground/5 p-2 flex items-center justify-center flex-shrink-0">
                                                                    <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-contain" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-[11px] font-black uppercase tracking-tight mb-2">{item.product?.name}</p>
                                                                    <div className="flex justify-between items-center text-[10px] text-foreground/60 uppercase font-black">
                                                                        <span>Qty: {item.quantity}</span>
                                                                        <span className="text-foreground">₹{item.priceAtTime?.toLocaleString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Summary Info */}
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" /> Shipping Delivery
                                                        </h3>
                                                        <div className="p-4 bg-white border border-foreground/5 text-[10px] leading-relaxed uppercase font-medium">
                                                            <p className="font-black mb-1">{order.shippingAddress?.fullName}</p>
                                                            <p className="text-foreground/60">
                                                                {order.shippingAddress?.addressLine1}<br />
                                                                {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                                                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                                                                {order.shippingAddress?.country}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                            <CreditCard className="h-4 w-4" /> Payment Summary
                                                        </h3>
                                                        <div className="p-4 bg-white border border-foreground/5 space-y-3">
                                                            <div className="flex justify-between text-[10px] uppercase font-bold text-foreground/60">
                                                                <span>Method</span>
                                                                <span className="text-foreground">{order.paymentMethod}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px] uppercase font-bold text-foreground/60">
                                                                <span>Payment Status</span>
                                                                <span className={`px-2 py-0.5 border ${order.paymentStatus === 'paid' ? 'border-emerald-500/20 text-emerald-500' : 'border-amber-500/20 text-amber-500'
                                                                    }`}>{order.paymentStatus || 'Pending'}</span>
                                                            </div>
                                                            <div className="pt-3 flex justify-between text-[12px] uppercase font-black border-t border-foreground/10">
                                                                <span>Final Total</span>
                                                                <span className="text-primary">₹{order.totalAmount.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
