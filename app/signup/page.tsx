'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowRight, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                // Redirect to verify email with email in query param
                router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
            } else {
                setError(data.error || 'Failed to create account');
            }
        } catch (err) {
            setError('Connection failed. Please check your internet.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
            <Header />

            <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md space-y-12"
                >
                    {/* Simplified Language Header */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Welcome</span>
                        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-foreground">
                            Create <br />Account
                        </h1>
                        <p className="text-muted-foreground font-light text-lg">
                            Join us to manage your equipment and clinical workspace.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                                    <User className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="FULL NAME"
                                    className="w-full bg-white border border-foreground/[0.08] rounded-none py-4 px-12 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-[10px] placeholder:font-black placeholder:tracking-widest placeholder:uppercase placeholder:opacity-30"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="EMAIL ADDRESS"
                                    className="w-full bg-white border border-foreground/[0.08] rounded-none py-4 px-12 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-[10px] placeholder:font-black placeholder:tracking-widest placeholder:uppercase placeholder:opacity-30"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="PASSWORD"
                                    className="w-full bg-white border border-foreground/[0.08] rounded-none py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-[10px] placeholder:font-black placeholder:tracking-widest placeholder:uppercase placeholder:opacity-30"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center opacity-20 hover:opacity-100 transition-opacity"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                            >
                                <span>⚠️</span> {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 rounded-none bg-black text-white hover:bg-primary transition-all duration-500 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="pt-8 border-t border-foreground/[0.05] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="opacity-40">Already have an account?</span>
                        <Link href="/signin" className="text-primary hover:tracking-[0.4em] transition-all duration-300">
                            Sign In
                        </Link>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
