'use client'

import React, { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    ChevronDown,
    MoreVertical,
    MapPin,
    CreditCard,
    Phone,
    Mail,
    User,
    Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/orders')
            const data = await res.json()
            if (data.success) setOrders(data.orders)
        } catch (error) {
            toast.error('Failed to load orders.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const updateOrderStatus = async (orderId: string, status: string, invoiceUrl?: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status, invoiceUrl })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(invoiceUrl !== undefined ? 'Invoice URL saved' : `Order status updated to ${status}`)
                fetchOrders()
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status, invoiceUrl: invoiceUrl !== undefined ? invoiceUrl : selectedOrder.invoiceUrl })
                }
            }
        } catch (error) {
            toast.error('Failed to update order.')
        }
    }

    const filteredOrders = orders.filter(o =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-foreground">Orders</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Track and manage customer orders</p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-8 bg-white border border-foreground/[0.05]">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="SEARCH BY ORDER ID OR EMAIL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-none border border-foreground/10 bg-[#fbfbfb] focus:outline-none focus:border-black text-[9px] font-black uppercase tracking-widest transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-none border-foreground/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-foreground/[0.01]">
                        <Filter className="h-4 w-4 opacity-40" />
                        Filter Orders
                    </Button>
                </div>
            </div>

            {/* Orders Feed */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <motion.div
                            key={order._id}
                            layout
                            className="bg-white border border-foreground/[0.05] overflow-hidden hover:border-foreground/10 transition-all hover:shadow-2xl hover:shadow-black/5"
                        >
                            <div className="p-8 border-b border-foreground/[0.03] flex flex-wrap justify-between items-center gap-8 bg-[#fbfbfb]">
                                <div className="flex gap-12">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-1">Order ID</p>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-foreground">#{order._id.slice(-12).toUpperCase()}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-1">Status</p>
                                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border ${order.status === 'delivered' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-50/50' :
                                            order.status === 'shipped' ? 'border-blue-500/20 text-blue-500 bg-blue-50/50' :
                                                'border-amber-500/20 text-amber-500 bg-amber-50/50'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-1">Price</p>
                                        <p className="text-[11px] font-black text-foreground">₹{order.totalAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <select
                                        className="h-10 px-4 bg-white border border-foreground/10 text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-black"
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    >
                                        <option value="pending">Mark Pending</option>
                                        <option value="processing">Start Processing</option>
                                        <option value="shipped">Mark as Shipped</option>
                                        <option value="delivered">Confirm Delivery</option>
                                        <option value="cancelled">Cancel Order</option>
                                    </select>
                                    <Button
                                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                                        variant="outline"
                                        className="h-10 px-6 rounded-none border-foreground/10 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                    >
                                        {selectedOrder?._id === order._id ? 'Close Details' : 'View Details'}
                                    </Button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {selectedOrder?._id === order._id && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden bg-[#fcfcfc]"
                                    >
                                        <div className="p-12 grid lg:grid-cols-3 gap-16">
                                            {/* Shipping & Payment */}
                                            <div className="space-y-12">
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3 text-primary">
                                                        <MapPin className="h-4 w-4" />
                                                        <h3 className="text-[10px] font-black uppercase tracking-widest">Shipping Address</h3>
                                                    </div>
                                                    <div className="p-6 border border-foreground/[0.05] bg-white space-y-2">
                                                        <p className="text-[11px] font-black uppercase">{order.shippingAddress?.fullName}</p>
                                                        <p className="text-[10px] text-foreground/60 leading-relaxed font-medium capitalize">
                                                            {order.shippingAddress?.addressLine1}<br />
                                                            {order.shippingAddress?.addressLine2 && <>{order.shippingAddress?.addressLine2}<br /></>}
                                                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                                                            {order.shippingAddress?.country}
                                                        </p>
                                                        <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-foreground/40">
                                                            <Phone className="h-3 w-3" />
                                                            {order.shippingAddress?.phone}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3 text-primary">
                                                        <CreditCard className="h-4 w-4" />
                                                        <h3 className="text-[10px] font-black uppercase tracking-widest">Payment Info</h3>
                                                    </div>
                                                    <div className="p-6 border border-foreground/[0.05] bg-white space-y-4">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-2">Payment Method</p>
                                                            <p className="text-[11px] font-black uppercase">{order.paymentMethod || 'Online Payment'}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border ${order.paymentStatus === 'paid' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-50/50' : 'border-amber-500/20 text-amber-500 bg-amber-50/50'}`}>
                                                                {order.paymentStatus || 'Pending'}
                                                            </span>
                                                        </div>
                                                        <div className="pt-4 border-t border-foreground/[0.05]">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-2">Invoice URL</p>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="https://..."
                                                                    className="flex-1 h-8 px-3 text-[10px] font-medium border border-foreground/10 focus:outline-none focus:border-primary"
                                                                    defaultValue={order.invoiceUrl || ''}
                                                                    onBlur={(e) => {
                                                                        if (e.target.value !== order.invoiceUrl) {
                                                                            updateOrderStatus(order._id, order.status, e.target.value);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <p className="text-[8px] mt-1 text-foreground/40 italic">Link to Google Drive / S3 invoice PDF. Loses focus to save.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Consignee Data */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 text-primary">
                                                    <User className="h-4 w-4" />
                                                    <h3 className="text-[10px] font-black uppercase tracking-widest">Customer Info</h3>
                                                </div>
                                                <div className="p-8 bg-black text-white space-y-4">
                                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                                                        <User className="h-6 w-6 opacity-40" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] font-black uppercase tracking-tight">{order.user?.name}</p>
                                                        <p className="text-[10px] text-white/40 mt-1 uppercase truncate">{order.user?.email}</p>
                                                    </div>
                                                    <button onClick={() => window.location.href = `/ admin / users ? email = ${order.user?.email}`} className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">View User History</button>
                                                </div>
                                            </div>

                                            {/* Resource Summary */}
                                            <div className="space-y-6 lg:border-l lg:border-foreground/[0.05] lg:pl-16">
                                                <div className="flex items-center gap-3 text-primary">
                                                    <Package className="h-4 w-4" />
                                                    <h3 className="text-[10px] font-black uppercase tracking-widest">Order Items</h3>
                                                </div>
                                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                                    {order.items?.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex gap-4 p-4 border border-foreground/[0.03] bg-white hover:border-foreground/10 transition-colors">
                                                            <div className="w-16 h-16 bg-[#fbfbfb] border border-foreground/[0.05] flex-shrink-0 flex items-center justify-center p-2">
                                                                <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-contain" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10px] font-black uppercase tracking-tight text-foreground truncate">{item.product?.name}</p>
                                                                <p className="text-[9px] text-foreground/40 mt-1 font-bold uppercase">Qty: {item.quantity} • ₹{item.priceAtTime.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-6 border-t border-foreground/10 space-y-2">
                                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/40">
                                                        <span>Subtotal</span>
                                                        <span>₹{order.totalAmount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/40">
                                                        <span>Shipping Fee</span>
                                                        <span>₹0.00</span>
                                                    </div>
                                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-foreground pt-4 border-t border-foreground/[0.05]">
                                                        <span>Total Amount</span>
                                                        <span className="text-primary font-black">₹{order.totalAmount.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
