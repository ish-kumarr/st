'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User as UserIcon,
    ShieldCheck,
    ChevronRight,
    Search,
    Mail,
    Fingerprint,
    ArrowRight,
    Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Inventory', icon: Package, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
    { name: 'Users', icon: Users, href: '/admin/users' },
]

function AdminLogin() {
    const [step, setStep] = useState<'initial' | 'otp-received'>('initial');
    const [formData, setFormData] = useState({ email: 'satyavij.care@gmail.com', otp: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn, checkSession } = useAuth();
    const router = useRouter();

    const handleSendOTP = async () => {
        if (!formData.email) {
            setError('Email address is required.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();
            if (data.success) {
                setStep('otp-received');
                toast.success(data.message);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Could not send the code. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: formData.otp }),
            });
            const data = await res.json();
            if (data.success) {
                signIn(data.user);
                await checkSession();
                toast.success('Admin authentication successful');
                router.refresh();
                router.push('/admin/dashboard');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 selection:bg-white selection:text-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md bg-black border border-white/10 p-12 space-y-12 shadow-2xl shadow-black"
            >
                <div className="space-y-4 text-center">
                    <div className="w-16 h-16 bg-white mx-auto flex items-center justify-center mb-8">
                        <ShieldCheck className="h-8 w-8 text-black" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Workspace Access</span>
                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">
                        Admin<br />Login
                    </h1>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'initial' ? (
                        <motion.div
                            key="initial"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-40">
                                    <Mail className="h-4 w-4 text-white" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    readOnly
                                    className="w-full bg-white/5 border border-white/10 rounded-none py-5 px-12 text-xs font-bold text-white focus:outline-none focus:border-white transition-all cursor-not-allowed text-center"
                                    value={formData.email}
                                />
                            </div>

                            {error && (
                                <div className="p-5 border border-red-500/20 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                onClick={handleSendOTP}
                                disabled={isLoading}
                                className="w-full h-16 rounded-none bg-white text-black hover:bg-white/90 transition-all font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 border-none"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <>Request Access <ArrowRight className="h-4 w-4" /></>}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="otp"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onSubmit={handleVerifyOTP}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2 mb-8">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Code Sent To</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">{formData.email}</p>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">
                                    <Fingerprint className="h-4 w-4 text-white" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-full bg-white/5 border border-white/10 rounded-none py-6 px-12 text-center text-3xl font-black text-white tracking-[0.5em] focus:outline-none focus:border-white transition-all placeholder:text-[10px] placeholder:tracking-widest placeholder:opacity-30"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                />
                            </div>

                            {error && (
                                <div className="p-5 border border-red-500/20 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] text-center">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    type="button"
                                    onClick={() => setStep('initial')}
                                    className="h-16 rounded-none bg-transparent border border-white/20 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/5"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-16 rounded-none bg-white text-black hover:bg-white/90 transition-all font-black uppercase tracking-[0.3em] text-[10px] border-none"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : 'Log In'}
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const { user, isLoading, signOut } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white/20" />
            </div>
        )
    }

    if (!user || user.role !== 'admin') {
        return <AdminLogin />
    }

    return (
        <div className="min-h-screen bg-[#f8f9fc] flex">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-foreground/[0.05] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-8 border-b border-foreground/[0.05] flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase">Satyavij <span className="text-primary">Admin</span></span>
                        </Link>
                        <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="flex-1 p-6 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-4 font-black uppercase tracking-widest text-[10px] transition-all group ${isActive ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-foreground/40 hover:text-foreground hover:bg-foreground/[0.03]'}`}
                                >
                                    <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'group-hover:text-foreground'}`} />
                                    {item.name}
                                    {isActive && <ChevronRight className="ml-auto h-3 w-3" />}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-6 border-t border-foreground/[0.05]">
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-4 px-4 py-4 font-black uppercase tracking-widest text-[10px] text-red-500 hover:bg-red-50 transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-foreground/[0.05] flex items-center justify-between px-8 z-40">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="hidden md:flex items-center gap-4 px-4 h-10 bg-foreground/[0.03] border border-foreground/[0.05] w-96 group">
                            <Search className="h-4 w-4 text-foreground/40 group-focus-within:text-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-widest w-full placeholder:text-foreground/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-foreground/40 hover:text-foreground transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-foreground/[0.05]"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Admin</p>
                                <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1">Administrator</p>
                            </div>
                            <div className="w-10 h-10 border border-foreground/[0.1] bg-foreground/[0.05] flex items-center justify-center">
                                <UserIcon className="h-5 w-5 opacity-40" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}
