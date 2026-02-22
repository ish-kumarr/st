'use client'

import React, { useState, useEffect } from 'react'
import {
    TrendingUp,
    ShoppingCart,
    Users,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Calendar,
    Search
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useCurrency } from '@/hooks/use-currency'

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { formatPrice } = useCurrency()

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/admin/orders?limit=5')
                ])

                const statsData = await statsRes.json()
                const ordersData = await ordersRes.json()

                if (statsData.success) setStats(statsData.stats)
                if (ordersData.success) setRecentOrders(ordersData.orders.slice(0, 5))
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const cards = [
        { name: 'Total Revenue', value: stats?.totalSales || 0, icon: TrendingUp, trend: stats?.revenueTrend || '+0%', color: 'text-emerald-500', isCurrency: true },
        { name: 'Active Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, trend: stats?.ordersTrend || '+0%', color: 'text-blue-500' },
        { name: 'Total Users', value: stats?.totalUsers || 0, icon: Users, trend: stats?.usersTrend || '+0%', color: 'text-purple-500' },
        { name: 'Inventory Units', value: stats?.totalInventoryUnits || 0, icon: Package, trend: stats?.productsTrend || '+0%', color: 'text-amber-500' },
    ]

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-foreground">Dashboard</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Site statistics and performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 border border-foreground/[0.05] hover:border-foreground/10 transition-all hover:shadow-2xl hover:shadow-black/5 group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 bg-foreground/[0.02] border border-foreground/[0.03] group-hover:bg-black group-hover:text-white transition-colors`}>
                                <card.icon className="h-5 w-5" />
                            </div>
                            <span className={`text-[10px] font-black flex items-center gap-1 ${card.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                {card.trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {card.trend}
                            </span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{card.name}</p>
                        <h3 className="text-3xl font-black tracking-tighter text-foreground">
                            {card.isCurrency ? `₹${card.value.toLocaleString()}` : card.value}
                        </h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white border border-foreground/[0.05] overflow-hidden">
                    <div className="p-8 border-b border-foreground/[0.05] flex justify-between items-center bg-[#fbfbfb]">
                        <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Recent Orders</h2>
                        <button onClick={() => window.location.href = '/admin/orders'} className="text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:underline">View All Orders</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fcfcfc] border-b border-foreground/[0.03]">
                                <tr>
                                    {['Order ID', 'Status', 'Total Price', 'Date'].map(h => (
                                        <th key={h} className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-foreground/30">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/[0.03]">
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-foreground/[0.01] transition-colors group">
                                        <td className="px-8 py-5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">#{order._id.slice(-8)}</p>
                                            <p className="text-[9px] text-foreground/40 mt-1 uppercase">{order.user?.name}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border ${order.status === 'delivered' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-50/50' :
                                                order.status === 'processing' ? 'border-blue-500/20 text-blue-500 bg-blue-50/50' :
                                                    'border-amber-500/20 text-amber-500 bg-amber-50/50'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-[10px] font-bold text-foreground">₹{order.totalAmount.toLocaleString()}</td>
                                        <td className="px-8 py-5 text-[9px] text-foreground/40 font-medium uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Insights */}
                <div className="space-y-8">
                    <div className="bg-black text-white p-8 space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-tighter">Summary</h3>
                        <p className="text-xs text-white/60 font-light leading-relaxed">
                            {stats?.summaryText || "Calculating insights from the database..."}
                        </p>
                        <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white transition-all">
                            Download Report
                        </button>
                    </div>

                    <div className="bg-white border border-foreground/[0.05] p-8">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/50 mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Add New Product', icon: Package, color: 'text-amber-500', href: '/admin/products' },
                                { name: 'Verify New Users', icon: Users, color: 'text-indigo-500', href: '/admin/users' },
                                { name: 'Update Stock Levels', icon: Package, color: 'text-blue-500', href: '/admin/products' },
                            ].map(action => (
                                <button key={action.name} className="w-full flex items-center gap-4 p-4 border border-foreground/[0.03] hover:border-foreground/10 hover:bg-foreground/[0.01] transition-all group text-left">
                                    <action.icon className={`h-4 w-4 ${action.color}`} />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground group-hover:translate-x-1 transition-transform">{action.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
