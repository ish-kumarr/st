'use client'

import React, { useState, useEffect } from 'react'
import {
    Search,
    Users,
    MoreVertical,
    Mail,
    Calendar,
    Shield,
    ShieldAlert,
    Loader2,
    Filter,
    ArrowUpRight,
    User as UserIcon,
    Trash2,
    History,
    FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            if (data.success) setUsers(data.users)
        } catch (error) {
            toast.error('Failed to load user data.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (id: string, role: string) => {
        if (role === 'admin') {
            toast.error("Administrators cannot be deleted from the dashboard.");
            return;
        }

        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('User deleted successfully.');
                setUsers(users.filter(u => u._id !== id));
            } else {
                toast.error(data.error || 'Failed to delete user.');
            }
        } catch (error) {
            toast.error('System error occurred while deleting.');
        }
    };

    useEffect(() => {
        fetchUsers()
    }, [])

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-foreground">Users</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Manage user accounts and verification</p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-8 bg-white border border-foreground/[0.05]">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME OR EMAIL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-none border border-foreground/10 bg-[#fbfbfb] focus:outline-none focus:border-black text-[9px] font-black uppercase tracking-widest transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-none border-foreground/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-foreground/[0.01]">
                        <Filter className="h-4 w-4 opacity-40" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-foreground/[0.05] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fcfcfc] border-b border-foreground/[0.05]">
                                <tr>
                                    {['User', 'Role', 'Status', 'Registration Date', 'Activity', 'Actions'].map(h => (
                                        <th key={h} className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-foreground/30">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/[0.03]">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-foreground/[0.01] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-foreground/[0.05] border border-foreground/[0.1] flex-shrink-0 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all">
                                                    <UserIcon className="h-5 w-5 text-foreground/40 group-hover:text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{u.name || 'Anonymous User'}</p>
                                                    <p className="text-[9px] text-foreground/40 mt-1 uppercase font-medium">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {u.role === 'admin' ? (
                                                    <Shield className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <UserIcon className="h-4 w-4 text-foreground/20" />
                                                )}
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'text-primary' : 'text-foreground/60'}`}>
                                                    {u.role || 'User'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border ${u.isVerified ? 'border-emerald-500/20 text-emerald-500 bg-emerald-50/50' : 'border-amber-500/20 text-amber-500 bg-amber-50/50'
                                                }`}>
                                                {u.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] text-foreground/40 font-bold uppercase tracking-tight">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 leading-none">Activity</span>
                                                <span className="text-[10px] font-black text-foreground">Frequent</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2 text-right justify-end w-full">
                                                <button onClick={() => handleDeleteUser(u._id, u.role)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 hover:border-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { label: 'New Members', value: '+14%', color: 'text-emerald-500' },
                    { label: 'Verified Users', value: '89%', color: 'text-blue-500' },
                    { label: 'Admin Ratio', value: '4.2%', color: 'text-amber-500' },
                ].map(stat => (
                    <div key={stat.label} className="p-8 bg-white border border-foreground/[0.05]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-2">{stat.label}</p>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-black tracking-tighter">{stat.value}</span>
                            <ArrowUpRight className={`h-5 w-5 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
