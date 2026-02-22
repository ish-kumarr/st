'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Mail, ShieldCheck, Lock, ArrowRight, Loader2, Key, Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                setStep(2);
                setMessage('A reset code has been sent to your email.');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Password updated. Redirecting to sign-in...');
                setTimeout(() => router.push('/signin'), 2000);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to update password');
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
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Reset Password</span>
                        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-foreground">
                            Reset <br />Password
                        </h1>
                        <p className="text-muted-foreground font-light text-lg">
                            {step === 1
                                ? 'Enter your email to receive a password reset code.'
                                : 'Enter the code and your new password to restore access.'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onSubmit={handleRequestOTP}
                                className="space-y-6"
                            >
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="EMAIL ADDRESS"
                                        className="w-full bg-white border border-foreground/[0.08] rounded-none py-4 px-12 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-[10px] placeholder:font-black placeholder:tracking-widest placeholder:uppercase placeholder:opacity-30"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-16 rounded-none bg-black text-white hover:bg-primary transition-all duration-500 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send Reset Code <ArrowRight className="h-4 w-4" /></>}
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onSubmit={handleResetPassword}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="6-DIGIT CODE"
                                            className="w-full bg-white border border-foreground/[0.08] rounded-none py-4 px-12 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-[10px] placeholder:font-black placeholder:tracking-widest placeholder:uppercase placeholder:opacity-30"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            placeholder="NEW PASSWORD"
                                            className="w-full bg-white border border-foreground/[0.08] rounded-none py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-[10px] placeholder:font-black placeholder:tracking-widest placeholder:uppercase placeholder:opacity-30"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
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
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                {message && (
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        <span>✅</span> {message}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-16 rounded-none bg-black text-white hover:bg-primary transition-all duration-500 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="pt-8 border-t border-foreground/[0.05] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="opacity-40">Remembered your password?</span>
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
